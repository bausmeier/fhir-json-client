'use strict'

const http = require('http')
const https = require('https')
const request = require('./request')
const url = require('url')

class Client {
  constructor (options = {}) {
    if (typeof options === 'string') {
      options = url.parse(options)
    }
    options.path = options.path || '/'

    if (options.agent == null) {
      if (options.protocol === 'https:') {
        options.agent = new https.Agent({
          // Enable keep-alive connections
          keepAlive: true,
          // Pass through the TLS options
          pfx: options.pfx,
          key: options.key,
          passphrase: options.passphrase,
          cert: options.cert,
          ca: options.ca,
          ciphers: options.ciphers,
          rejectUnauthorized: !(options.rejectUnauthorized === false),
          secureProtocol: options.secureProtocol,
          servername: options.servername
        })
      } else {
        options.agent = new http.Agent({keepAlive: true})
      }
    }

    this._options = options
  }

  close () {
    this._options.agent.destroy()
  }

  create (resource, override, callback) {
    if (typeof override === 'function') {
      callback = override
      override = null
    }
    const options = Object.assign({}, this._options, override)
    options.method = 'POST'
    options.path = url.resolve(options.path, resource.resourceType)
    request(options, resource, callback)
  }

  update (resource, override, callback) {
    if (typeof override === 'function') {
      callback = override
      override = null
    }
    const options = Object.assign({}, this._options, override)
    options.method = 'PUT'
    options.path = url.resolve(options.path, `${resource.resourceType}/${resource.id}`)
    request(options, resource, callback)
  }

  read (resourceType, id, override, callback) {
    if (typeof override === 'function') {
      callback = override
      override = null
    }
    const options = Object.assign({}, this._options, override)
    options.method = 'GET'
    options.path = url.resolve(options.path, `${resourceType}/${id}`)
    request(options, callback)
  }

  vread (resourceType, id, versionId, override, callback) {
    if (typeof override === 'function') {
      callback = override
      override = null
    }
    const options = Object.assign({}, this._options, override)
    options.method = 'GET'
    options.path = url.resolve(options.path, `${resourceType}/${id}/_history/${versionId}`)
    request(options, callback)
  }

  delete (resourceType, id, override, callback) {
    if (typeof override === 'function') {
      callback = override
      override = null
    }
    const options = Object.assign({}, this._options, override)
    options.method = 'DELETE'
    options.path = url.resolve(options.path, `${resourceType}/${id}`)
    request(options, callback)
  }

  transaction (bundle, override, callback) {
    if (typeof override === 'function') {
      callback = override
      override = null
    }
    const options = Object.assign({}, this._options, override)
    options.method = 'POST'
    request(options, bundle, callback)
  }

  search (resourceType, query, override, callback) {
    if (typeof override === 'function') {
      callback = override
      override = null
    }
    const options = Object.assign({}, this._options, override)
    options.method = 'GET'
    options.path = url.format({
      pathname: url.resolve(options.path, resourceType),
      query
    })
    request(options, callback)
  }
}

module.exports = exports = Client
