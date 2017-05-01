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

  t.tearDown(() => {
    server.close()
  })

  server.listen(() => {
    const {port} = server.address()

    const client = new Client({port})

    t.tearDown(() => {
      client.close()
    })

    t.test('should set keep-alive header', (t) => {
      server.once('request', (req, res) => {
        t.equal(req.headers.connection, 'keep-alive')

        res.writeHead(200)
        res.end()
      })

      client.read('Patient', '1', (err, res, body) => {
        t.error(err)
        t.equal(res.headers.connection, 'keep-alive')
        t.end()
      })
    })

    t.end()
  })
})
