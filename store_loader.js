const fetch = require('node-fetch')
var parse = require('node-html-parser').parse
const api = require('./ikeapi')
const fs = require('fs')

fetch('https://www.ikea.com/fr/fr/stores/').then(d => d.text()).then(async html => {

    let data = parse(html);
    let stores = data.querySelector('#21b22c30-b5d0-11e8-8cd1-43d001760629').querySelectorAll('a')
        .map(elm => elm.childNodes[0].rawText)

    let all_proms = stores.map(name => {
        return new Promise(ok => {
            let true_name = name.split(' - ')
            true_name = true_name[true_name.length - 1]
            api.full_search(true_name).then(dat => {
                let data = dat.storeWindow[0] || {}
                data.full_name = name
                ok(data)
            }).catch(e => ok(null))
        })
    })

    console.log('START...')
    let all_result = await Promise.all(all_proms)
    console.log('END !')

    fs.writeFileSync('./stores.json', JSON.stringify(all_result))

    console.log('written')
})