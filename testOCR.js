const fetch = require('node-fetch')
const fs = require('fs')
const util = require('util');

const request = require('request')

let base64Image = fs.readFileSync('IMG', 'UTF8')

var apikey = '8e65f273cd88957'

const uri = {
    method: 'post',
    url: 'https://api.ocr.space/parse/image',
    form: {
        language: 'fre',
        apikey: apikey,
        isOverlayRequired: false,
        base64Image
    },
    headers: {
        "content-type": "application/json",
    },
    json: true,
};

request(uri, function (error, response, ocrParsedResult) {
    var parsedResults = ocrParsedResult["ParsedResults"]?.[0]?.ParsedText;
    console.log(parsedResults)
})