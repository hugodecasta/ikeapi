const checker = require('ikea-availability-checker');
const IOW2 = require('ikea-availability-checker/source/lib/iows2')

let grand_parilly_code = process.argv[2]
let kallax_code = process.argv[3].split('.').join('')

console.log(grand_parilly_code)
console.log(kallax_code)

async function main() {
    console.log(await checker.stores.findById(grand_parilly_code))
    console.log(await checker.availability(grand_parilly_code, kallax_code))
}

// main()

const fetch = require('node-fetch')

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

getProductData(20105341).then(resp => resp.json()).then(pdata => {

    let image = pdata.RetailItemComm.RetailItemImageList.RetailItemImage[3].ImageUrl.$
    console.log(image)

})