// TODO: Handle compression

'use strict'

const http = require('http')
const https = require('http')
const typer = require('media-typer')
const {name: packageName, version: packageVersion} = require('../package')

const DEFAULT_HEADERS = {
  'Accept': 'application/fhir+json, application/json;q=0.9',
  'Accept-Charset': 'utf-8',
  'Accept-Encoding': 'identity',
  'User-Agent': `${packageName}/${packageVersion}`
}

function isParseable (contentType) {
  if (!contentType) {
    return false
  }

  const {type, subtype, suffix} = typer.parse(contentType)

  if (type !== 'application') {
    return false
  }

  // Check for 'fhir+json'
  if (subtype === 'fhir' && suffix === 'json') {
    return true
  }

  // Check for 'json'
  return subtype === 'json'
}

function buildResponseHandler (callback) {
  return function (res) {
    let body = ''

    // Set the encoding so that chunks are strings
    res.setEncoding('utf8')

    // Handle data events
    res.on('data', (data) => {
      body += data
    })

    // Handle errors
    res.once('error', callback)

    // Handle the end event
    res.once('end', () => {
      if (isParseable(res.headers['content-type'])) {
        try {
          body = JSON.parse(body)
        } catch (err) {
          return callback(err)
        }
      }
      const response = {
        statusCode: res.statusCode,
        headers: res.headers
      }
      callback(null, response, body)
    })
  }
}

function sendRequest (options, body, callback) {
  const protocol = options.protocol === 'https:' ? https : http

  // Set the default headers
  options.headers = Object.assign({}, options.headers, DEFAULT_HEADERS)

  if (typeof body === 'function') {
    callback = body
    body = null
  } else {
    body = JSON.stringify(body)
    options.headers['Content-Encoding'] = 'identity'
    options.headers['Content-Length'] = Buffer.byteLength(body)
    options.headers['Content-Type'] = 'application/fhir+json; charset=utf-8'
  }

  const req = protocol.request(options, buildResponseHandler(callback))
  req.once('error', callback)

  if (body) {
    req.write(body)
  }

  req.end()
}

module.exports = exports = sendRequest