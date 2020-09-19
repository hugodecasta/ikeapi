const api = require('./ikeapi')

let text = `et la et
LIBRE SERVICE MEUBLE
203.394.20
20339420
`
let pid = text.match(/[0-9]{2,3}.[0-9]{2,3}.[0-9]{2,3}|[0-9]{7,8}/gm)
console.log(pid)