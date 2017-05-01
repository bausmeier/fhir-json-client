'use strict'

const Client = require('../lib/client')
const http = require('http')
const tap = require('tap')

tap.test('content type', (t) => {
  const server = http.createServer()

  t.afterEach((next) => {
    server.removeAllListeners('request')
    next()
  })

  server.listen(() => {
    const {port} = server.address()

    const client = new Client({port})

    t.tearDown(() => {
      client.close()
      server.close()
    })

    const jsonBody = {
      resourceType: 'Patient',
      id: '1',
      name: [
        {
          given: ['Brett'],
          family: ['Ausmeier']
        }
      ]
    }

    const stringBody = JSON.stringify(jsonBody)

    t.test('should propagate unacceptable status code', (t) => {
      server.once('request', (req, res) => {
        t.match(req.headers, {
          accept: 'application/fhir+json, application/json;q=0.9',
          'accept-charset': 'utf-8'
        })

        res.writeHead(405)
        res.end()
      })

      client.read('Patient', '1', (err, res, body) => {
        t.error(err)
        t.equal(res.statusCode, 405)
        t.end()
      })
    })

    t.test('should not parse bodies with no content type', (t) => {
      server.once('request', (req, res) => {
        t.match(req.headers, {
          accept: 'application/fhir+json, application/json;q=0.9',
          'accept-charset': 'utf-8'
        })

        res.writeHead(200)
        res.end(stringBody)
      })

      client.read('Patient', '1', (err, res, body) => {
        t.error(err)
        t.deepEqual(body, stringBody)
        t.end()
      })
    })

    t.test('should not parse bodies with unparseable type', (t) => {
      server.once('request', (req, res) => {
        t.match(req.headers, {
          accept: 'application/fhir+json, application/json;q=0.9',
          'accept-charset': 'utf-8'
        })

        res.writeHead(200, {
          'Content-Type': 'text/plain; charset=utf-8'
        })
        res.end(stringBody)
      })

      client.read('Patient', '1', (err, res, body) => {
        t.error(err)
        t.deepEqual(body, stringBody)
        t.end()
      })
    })

    t.test('should not parse bodies with unparseable subtype', (t) => {
      server.once('request', (req, res) => {
        t.match(req.headers, {
          accept: 'application/fhir+json, application/json;q=0.9',
          'accept-charset': 'utf-8'
        })

        res.writeHead(200, {
          'Content-Type': 'application/xml; charset=utf-8'
        })
        res.end(stringBody)
      })

      client.read('Patient', '1', (err, res, body) => {
        t.error(err)
        t.deepEqual(body, stringBody)
        t.end()
      })
    })

    t.test('should not parse bodies with unparseable suffix', (t) => {
      server.once('request', (req, res) => {
        t.match(req.headers, {
          accept: 'application/fhir+json, application/json;q=0.9',
          'accept-charset': 'utf-8'
        })

        res.writeHead(200, {
          'Content-Type': 'application/fhir+xml; charset=utf-8'
        })
        res.end(stringBody)
      })

      client.read('Patient', '1', (err, res, body) => {
        t.error(err)
        t.deepEqual(body, stringBody)
        t.end()
      })
    })

    t.test('should parse bodies with application/json content type', (t) => {
      server.once('request', (req, res) => {
        t.match(req.headers, {
          accept: 'application/fhir+json, application/json;q=0.9',
          'accept-charset': 'utf-8'
        })

        res.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8'
        })
        res.end(stringBody)
      })

      client.read('Patient', '1', (err, res, body) => {
        t.error(err)
        t.deepEqual(body, jsonBody)
        t.end()
      })
    })

    t.test('should parse bodies with application/fhir+json content type', (t) => {
      server.once('request', (req, res) => {
        t.match(req.headers, {
          accept: 'application/fhir+json, application/json;q=0.9',
          'accept-charset': 'utf-8'
        })

        res.writeHead(200, {
          'Content-Type': 'application/fhir+json; charset=utf-8'
        })
        res.end(stringBody)
      })

      client.read('Patient', '1', (err, res, body) => {
        t.error(err)
        t.deepEqual(body, jsonBody)
        t.end()
      })
    })

    t.test('should return a syntax error when parsing invalid content', (t) => {
      server.once('request', (req, res) => {
        t.match(req.headers, {
          accept: 'application/fhir+json, application/json;q=0.9',
          'accept-charset': 'utf-8'
        })

        res.writeHead(200, {
          'Content-Type': 'application/fhir+json; charset=utf-8'
        })
        res.end('x')
      })

      client.read('Patient', '1', (err, res, body) => {
        t.type(err, SyntaxError)
        t.end()
      })
    })

    t.end()
  })
})
