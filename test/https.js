'use strict'

const Client = require('..')
const fs = require('fs')
const https = require('https')
const path = require('path')
const tap = require('tap')

const cert = fs.readFileSync(path.join(__dirname, 'cert.pem'))
const key = fs.readFileSync(path.join(__dirname, 'key.pem'))

tap.test('https', (t) => {
  const server = https.createServer({cert, key})

  t.afterEach((next) => {
    server.removeAllListeners('request')
    next()
  })

  server.listen(() => {
    const {port} = server.address()

    const client = new Client({
      protocol: 'https:',
      port,
      ca: cert
    })

    t.tearDown(() => {
      client.close()
      server.close()
    })

    t.test('request', (t) => {
      server.on('request', (req, res) => {
        res.writeHead(200)
        res.end()
      })
      client.read('Patient', '1', (err, res, body) => {
        t.error(err)
        t.equal(res.statusCode, 200)
        t.end()
      })
    })

    t.end()
  })
})
