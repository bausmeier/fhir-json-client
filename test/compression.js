'use strict'

const Client = require('..')
const http = require('http')
const tap = require('tap')

tap.test('Compression', (t) => {
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

    t.test('should send supported encodings in accept header', (t) => {
      server.once('request', (req, res) => {
        t.equal(req.headers['accept-encoding'], 'gzip,deflate')
        res.writeHead(200)
        res.end()
      })

      client.read('Patient', '1', (err, res, body) => {
        t.error(err)
        t.end()
      })
    })

    t.test('should decompress gzip response bodies', (t) => {
      server.once('request', (req, res) => {
        res.writeHead(200, {
          'Content-Encoding': 'gzip',
          'Content-Type': 'application/json'
        })
        const data = Buffer.from(
          'H4sIAJQBOFkAA6vmUlBQKkotzi8tSk4NqSxIVbJSUApILMlMzStR0gFJZqaAhAyVuGq5AFuI3DktAAAA',
          'base64'
        )
        res.end(data)
      })

      client.read('Patient', '1', (err, res, body) => {
        t.error(err)
        t.deepEqual(body, {
          resourceType: 'Patient',
          id: '1'
        })
        t.end()
      })
    })

    t.test('should decompress deflate response bodies', (t) => {
      server.once('request', (req, res) => {
        res.writeHead(200, {
          'Content-Encoding': 'deflate',
          'Content-Type': 'application/json'
        })
        const data = Buffer.from(
          'eJyr5lJQUCpKLc4vLUpODaksSFWyUlAKSCzJTM0rUdIBSWamgIQMlbhqAS8mDGQ=',
          'base64'
        )
        res.end(data)
      })

      client.read('Patient', '1', (err, res, body) => {
        t.error(err)
        t.deepEqual(body, {
          resourceType: 'Patient',
          id: '1'
        })
        t.end()
      })
    })

    t.end()
  })
})
