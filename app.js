require('dotenv').config()

const express = require('express')
const api = require('./ikeapi')
const fs = require('fs')
const app = express()
const port = process.env.PORT

function rawBody(req, res, next) {
    req.setEncoding('utf8');
    req.rawBody = '';
    req.on('data', function (chunk) {
        req.rawBody += chunk;
    });
    req.on('end', function () {
        next();
    });
}

app.use(rawBody);

// ----------------------------------------------------------------------------------------- STATIC ASSETS

app.use('/assets', express.static(__dirname + '/web'))

// ----------------------------------------------------------------------------------------- VUE

const vues_dir = './web/vues'

function get_all_vues() {
    function read_dir_rec(dir) {
        let vues = {}
        let subs = fs.readdirSync(dir)
        for (let sub of subs) {
            let path = `${dir}/${sub}`
            if (fs.lstatSync(path).isDirectory()) {
                let subvues = read_dir_rec(path)
                for (let sub_vue_name in subvues) {
                    vues[sub_vue_name] = subvues[sub_vue_name]
                }
            }
            if (sub.includes('.vue')) {
                vues[sub.replace('.vue', '')] = path
            }
        }
        return vues
    }
    return read_dir_rec(vues_dir)
}

// ----------------------------------------- ROUTER

app.get('/vues/:file?', async function (req, res) {
    let file = req.params.file
    let vues = get_all_vues()
    if (!file) {
        res.send(Object.keys(vues))
        return
    }
    file = file.replace('.vue', '')
    let path = vues[file]
    if (!path) {
        res.status(404)
        res.send(`vue component ${file} not found.`)
        return
    }
    let file_data = fs.readFileSync(path, 'UTF8').replace('export default', 'module.exports =')
    res.send(file_data)
})

// ----------------------------------------- INDEX

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/web/index.html')
})
app.get('/available', (req, res) => {
    res.sendFile(__dirname + '/web/available.html')
})
app.get('/search', (req, res) => {
    res.sendFile(__dirname + '/web/search.html')
})
app.get('/position', (req, res) => {
    res.sendFile(__dirname + '/web/position.html')
})
app.get('/read', (req, res) => {
    res.sendFile(__dirname + '/web/readsign.html')
})

// ----------------------------------------- API

app.get('/api/stores', async (req, res) => {
    try {
        res.send(await api.stores())
    } catch (e) {
        res.status(e.code)
        res.send('ikea response: ' + e.error)
    }
})

app.get('/api/search/:query', async (req, res) => {
    let { query } = req.params
    try {
        res.send(await api.search_item(query))
    } catch (e) {
        res.status(e.code)
        res.send('ikea response: ' + e.error)
    }
})

app.post('/api/detect', async (req, res) => {
    let base64image = req.rawBody
    try {
        res.send(await api.detect_product_id(base64image))
    } catch (e) {
        console.log(e)
        res.status(e.code)
        res.send('detect error: ' + e.error)
    }
})

app.get('/api/nearest/:latitude/:longitude', async (req, res) => {
    try {
        res.send(await api.nearest_store(req.params))
    } catch (e) {
        console.log(e)
        res.status(e.code)
        res.send('ikea response: ' + e.error)
    }
})

app.get('/api/:product_id/', async (req, res) => {
    let { product_id } = req.params
    try {
        res.send(await api.getProductData(product_id))
    } catch (e) {
        res.status(e.code)
        res.send('ikea response: ' + e.error)
    }
})

app.get('/api/:product_id/:store_id', async (req, res) => {
    let { store_id, product_id } = req.params
    try {
        res.send(await api.getProductAvailability(store_id, product_id))
    } catch (e) {
        res.status(e.code)
        res.send('ikea response: ' + e.error)
    }
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
