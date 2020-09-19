var stores = {}

fetch('/stores.json').then((resp) => resp.json()).then((loaded_stores) => {
    stores = loaded_stores.filter(store => store.countryCode == 'fr')

    stores.forEach(store => {
        let option = document.createElement('option')
        option.innerHTML = store.name
        option.setAttribute('value', parseInt(store.buCode))
        document.getElementById('store_id').appendChild(option)
    });

    console.log(stores)
})

// 504.867.92

async function check() {
    let store_id = document.getElementById('store_id').value
    let product_id = '50486792' // document.getElementById('product_id').value.split('.').join('')
    let pdata = await (await getProductData(product_id)).json()
    console.log(pdata)
}

function getProductData(id, type = "ART") {
    let adapter = { name: "RetailItemComm", endpoint: "https://iows.ikea.com", contract: "37249", consumer: "MAMMUT" }
    let local_url = 'fr/fr'
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
    let url = adapter.endpoint + '/retail/iows/' + local_url + '/catalog/items/' + type + ',' + id
    return fetch(url, init);
}