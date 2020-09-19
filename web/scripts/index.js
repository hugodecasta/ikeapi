// -------------------------------------------------------------------------

var app = new Vue({
    el: '#app',
    components: load_vue_components(['index'])
})

// -------------------------------------------------------------------------

function fetch2(path, data = null) {
    let method = data ? 'POST' : 'GET'
    let body = data ? JSON.stringify(data) : null
    let headers = data ? {
        'Content-Type': 'application/json'
    } : {}
    return new Promise((ok, err) => {
        fetch(path, { headers, method, body }).then(async function (response) {
            if (!response.ok) {
                let text = await response.text()
                err(text)
                return
            }
            ok(response)
        })
    })
}

function goto(href, redirect = false) {
    window.dispatchEvent(new CustomEvent("goto", { detail: { href, redirect } }));
}

async function fetch_text(path) {
    return await (await fetch2(path)).text()
}
async function fetch_json(path, data = null) {
    return await (await fetch2(path, data)).json()
}

async function api(path, data = null) {
    return await fetch_json('/api' + path, data)
}

function load_vue_components(comp_names) {
    let components = {}
    for (let name of comp_names) {
        components[name] = httpVueLoader(`/vues/${name}.vue`)
    }
    return components
}

function get_url_entry(href) {
    return href.replace(/^.*\/\/[^\/]+/, "")
}

function get_base_href(href) {
    return '/' + get_url_entry(href).split('/')[1];
}

function clone(json) {
    return JSON.parse(JSON.stringify(json))
}

Number.prototype.mod = function (n) {
    return ((this % n) + n) % n;
};