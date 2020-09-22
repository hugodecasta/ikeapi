const fetch = require('node-fetch')
const request = require('request')
const fs = require('fs')

var adapter = { name: "RetailItemComm", endpoint: "https://iows.ikea.com", contract: "37249", consumer: "MAMMUT" }
var local_url = 'fr/fr'

const stores = JSON.parse(fs.readFileSync('./stores.json', 'utf8')).filter(dat => dat).filter(dat => dat.location)

async function getProductData(product_id, type = 'ART', raw = false) {
    let headers = {
        'Accept': 'application/vnd.ikea.iows+json;version=2.0',
        'Contract': adapter.contract,
        'Consumer': adapter.consumer,
    }
    let init = {
        method: 'GET',
        headers: headers,
        mode: 'cors',
    };
    let url = adapter.endpoint + '/retail/iows/' + local_url + '/catalog/items/' + type + ',' + product_id

    let response = await fetch(url, init)
    if (response.status != 200) {
        type = 'SPR'
        url = adapter.endpoint + '/retail/iows/' + local_url + '/catalog/items/' + type + ',' + product_id
        response = await fetch(url, init)
        if (response.status != 200) {
            console.log('error on getProductData', response)
            throw { error: response.statusText, code: response.status }
        }
    }
    let pdata = (await response.json()).RetailItemComm
    if (raw) return pdata

    let image = 'https://www.ikea.com' + pdata.RetailItemImageList.RetailItemImage[3].ImageUrl.$
    let name = pdata.ProductName.$
    let desc = pdata.ProductTypeName.$
    let price = pdata.RetailItemCommPriceList.RetailItemCommPrice.Price.$

    let price_parts = (price + '').split('.')

    return { image, name, desc, price, price_parts, product_id }
}

async function getProductAvailability(store_id, product_id, type = 'ART') {

    let headers = {
        'Accept': 'application/vnd.ikea.iows+json;version=1.0',
        'Contract': adapter.contract,
        'Consumer': adapter.consumer,
    }
    let init = {
        headers: headers,
    };

    let url = adapter.endpoint + '/retail/iows/' + local_url + '/stores/' + store_id + '/availability/' + type + '/' + product_id
    let response = await fetch(url, init)
    if (response.status != 200) {
        type = 'SPR'
        url = adapter.endpoint + '/retail/iows/' + local_url + '/stores/' + store_id + '/availability/' + type + '/' + product_id
        response = await fetch(url, init)
        if (response.status != 200) {
            console.log('error on getProductAvailability', response)
            throw { error: response.statusText, code: response.status }
        }
    }
    let adata = (await response.json()).StockAvailability

    let is_available = adata.RetailItemAvailability.InStockProbabilityCode.$
    let stock = adata.RetailItemAvailability.AvailableStock.$
    let forecast = adata.AvailableStockForecastList.AvailableStockForecast
        .map(day => { return { prob: day.InStockProbabilityCode.$, stock: day.AvailableStock.$ } })
    let location_data = null
    if (adata.RetailItemAvailability.RecommendedSalesLocation) {
        location_data = [adata.RetailItemAvailability.RecommendedSalesLocation.$]
    } else {
        location_data = adata.RetailItemAvailability.RetailItemCommChildAvailabilityList.RetailItemCommChildAvailability.map(c => c.RecommendedSalesLocation.$)
    }
    let location = location_data.map(ld => {
        let location_parsed = parseInt(ld)
        if (isNaN(location_parsed)) {
            return ld
        } else {
            let cut = Array.from('' + ld)
            let allee = parseInt(cut.slice(0, 2).join(''))
            let place = parseInt(cut.slice(2, 4).join(''))
            let etage = parseInt(cut.slice(4, 6).join(''))
            return [allee, place, etage]
        }
    })

    return { is_available, stock, location, location_data, forecast, adata }

}

async function getProductRestockData(product_id) {
    let url = `https://api.ingka.ikea.com/cia/availabilities/ru/fr?itemNos=${product_id}`
    const options = {
        method: 'GET',
        headers: { "x-client-id": "b6c117e5-ae61-4ef5-b4cc-e0b1e37f0631" },
        json: true,
    }
    let response = await fetch(url, options)
    if (response.status != 200) throw { error: response.statusText, code: response.status }
    let rdata = (await response.json()).data
    let restocks = rdata.map(subrdata => subrdata?.availableStocks)
        .reduce((acc, cur) => acc.concat(cur), [])
        .filter(srd => srd)
        .map(srd => srd.restocks)
        .reduce((acc, cur) => acc.concat(cur), [])
        .filter(srd => srd)
        .map(srd => {
            srd.date = new Date(srd.latestDate)
            return srd
        })
        .sort(function (a, b) {
            let datea = a.date
            let dateb = b.date
            if (datea < dateb) return -1
            if (datea > dateb) return 1
            return 0
        })
    if (!restocks.length) return { type: null }
    let nearest_restock = restocks[0]
    let type = nearest_restock.type
    let quantity = nearest_restock.quantity
    let date = {
        day: nearest_restock.date.getDate(),
        month: nearest_restock.date.getMonth() + 1,
        year: nearest_restock.date.getFullYear()
    }
    return { type, date, quantity }
}

function product_id_format(pid) {
    return pid.split('.').join('').replace('s', '')
}

async function getColourProducts(product_id) {
    let sdata = null
    try {
        sdata = await full_search(product_id)
    } catch (e) { throw e }
    let product = sdata.productWindow.filter(p => product_id_format(p.id) == product_id)[0] || sdata.productWindow[0]
    let related_raw = product.gprDescription.colors.filter(p => product_id_format(p.productId) != product_id)
    let related = await Promise.all(related_raw.map(r => getProductData(product_id_format(r.productId))))
    return { related, product }
}

async function search_item(name) {
    let url = `https://sik.search.blue.cdtapps.com/fr/fr/search-box?q=${name}&sessionId=e2f1ce5b-8991-4112-b232-9a629aad2f88&c=sb&v=20200709`
    let response = await fetch(url)
    if (response.status != 200) throw { error: response.statusText, code: response.status }
    return (await response.json()).searchBox
}

async function full_search(name) {
    let url = `https://sik.search.blue.cdtapps.com/fr/fr/search-result-page?max-num-filters=8&q=${name}&autocorrect=true&size=24&sessionId=e2f1ce5b-8991-4112-b232-9a629aad2f88&c=sr&v=20200709&store=562&subcategories-style=class-filter`
    let response = await fetch(url)
    if (response.status != 200) throw { error: response.statusText, code: response.status }
    return (await response.json()).searchResultPage
}

async function nearest_store(loc) {
    let all_stores = stores
    all_stores = all_stores.sort((a, b) => {
        let dista = Math.sqrt(Math.pow(parseFloat(a.location.latitude) - loc.latitude, 2) + Math.pow(parseFloat(a.location.longitude) - loc.longitude, 2))
        let distb = Math.sqrt(Math.pow(parseFloat(b.location.latitude) - loc.latitude, 2) + Math.pow(parseFloat(b.location.longitude) - loc.longitude, 2))
        if (dista > distb) return 1
        if (dista < distb) return -1
        return 0
    })
    return all_stores[0]
}

async function detect_product_id(base64Image) {
    const apikey = '8e65f273cd88957'
    const uri = {
        method: 'post',
        url: 'https://api.ocr.space/parse/image',
        form: {
            language: 'fre',
            apikey: apikey,
            isOverlayRequired: false,
            base64Image
        },
        timeout: 3000,
        headers: {
            "content-type": "application/json",
        },
        json: true,
    }
    return new Promise(ok => {
        request(uri, function (error, response, ocrParsedResult) {
            let text = ocrParsedResult?.["ParsedResults"]?.[0]?.ParsedText ?? null
            let product_id = text ? text.match(/[0-9]{2,3}.[0-9]{2,3}.[0-9]{2,3}|[0-9]{7,8}/gm)?.[0].split('.').join('') || null : null
            let product_id_str = product_id ? (product_id + '').match(/[0-9]{2,3}/g).join('.') : null
            ok({ text, product_id, product_id_str })
        })
    })
}

module.exports = { getProductData, getProductAvailability, getColourProducts, search_item, full_search, nearest_store, detect_product_id, getProductRestockData, stores }