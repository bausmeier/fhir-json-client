'use strict'

const Client = require('../lib/client')
const http = require('http')
const tap = require('tap')
const url = require('url')

tap.test('interactions', (t) => {
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

    t.test('read', (t) => {
      server.once('request', (req, res) => {
        t.equal(req.method, 'GET', 'should use the correct HTTP verb')
        t.equal(req.url, '/Patient/1', 'should request the correct path')
        res.writeHead(200)
        res.end()
      })
      client.read('Patient', '1', (err) => {
        t.error(err)
        t.end()
      })
    })

    t.test('read with overrides', (t) => {
      const requestId = 'b2653538-fe93-4da2-92d9-16e6efbfb779'
      server.once('request', (req, res) => {
        t.equal(req.method, 'GET', 'should use the correct HTTP verb')
        t.equal(req.url, '/Patient/1', 'should request the correct path')
        t.equal(req.headers['x-request-id'], requestId)
        res.writeHead(200)
        res.end()
      })
      const overrides = {
        headers: {
          'X-Request-Id': requestId
        }
      }
      client.read('Patient', '1', overrides, (err) => {
        t.error(err)
        t.end()
      })
    })

    t.test('vread', (t) => {
      server.once('request', (req, res) => {
        t.equal(req.method, 'GET', 'should use the correct HTTP verb')
        t.equal(req.url, '/Patient/1/_history/2', 'should request the correct path')
        res.writeHead(200)
        res.end()
      })
      client.vread('Patient', '1', '2', (err) => {
        t.error(err)
        t.end()
      })
    })

    t.test('vread with overrides', (t) => {
      const requestId = 'b2653538-fe93-4da2-92d9-16e6efbfb779'
      server.once('request', (req, res) => {
        t.equal(req.method, 'GET', 'should use the correct HTTP verb')
        t.equal(req.url, '/Patient/1/_history/2', 'should request the correct path')
        t.equal(req.headers['x-request-id'], requestId)
        res.writeHead(200)
        res.end()
      })
      const overrides = {
        headers: {
          'X-Request-Id': requestId
        }
      }
      client.vread('Patient', '1', '2', overrides, (err) => {
        t.error(err)
        t.end()
      })
    })

    t.test('create', (t) => {
      const patient = {
        resourceType: 'Patient',
        id: '1'
      }
      server.once('request', (req, res) => {
        let body = ''
        req.on('data', (data) => {
          body += data
        })
        req.on('end', () => {
          t.equal(req.method, 'POST', 'should use the correct HTTP verb')
          t.equal(req.url, '/Patient', 'should request the correct path')
          body = JSON.parse(body)
          t.deepEqual(body, patient, 'should have the correct body')
          res.writeHead(201)
          res.end()
        })
      })
      client.create(patient, (err) => {
        t.error(err)
        t.end()
      })
    })

    t.test('create with overrides', (t) => {
      const requestId = 'b2653538-fe93-4da2-92d9-16e6efbfb779'
      const patient = {
        resourceType: 'Patient',
        id: '1'
      }
      server.once('request', (req, res) => {
        let body = ''
        req.on('data', (data) => {
          body += data
        })
        req.on('end', () => {
          t.equal(req.method, 'POST', 'should use the correct HTTP verb')
          t.equal(req.url, '/Patient', 'should request the correct path')
          t.equal(req.headers['x-request-id'], requestId)
          body = JSON.parse(body)
          t.deepEqual(body, patient, 'should have the correct body')
          res.writeHead(201)
          res.end()
        })
      })
      const overrides = {
        headers: {
          'X-Request-Id': requestId
        }
      }
      client.create(patient, overrides, (err) => {
        t.error(err)
        t.end()
      })
    })

    t.test('update', (t) => {
      const patient = {
        resourceType: 'Patient',
        id: '1'
      }
      server.once('request', (req, res) => {
        let body = ''
        req.on('data', (data) => {
          body += data
        })
        req.on('end', () => {
          t.equal(req.method, 'PUT', 'should use the correct HTTP verb')
          t.equal(req.url, '/Patient/1', 'should request the correct path')
          body = JSON.parse(body)
          t.deepEqual(body, patient, 'should have the correct body')
          res.writeHead(200)
          res.end()
        })
      })
      client.update(patient, (err) => {
        t.error(err)
        t.end()
      })
    })

    t.test('update with overrides', (t) => {
      const requestId = 'b2653538-fe93-4da2-92d9-16e6efbfb779'
      const patient = {
        resourceType: 'Patient',
        id: '1'
      }
      server.once('request', (req, res) => {
        let body = ''
        req.on('data', (data) => {
          body += data
        })
        req.on('end', () => {
          t.equal(req.method, 'PUT', 'should use the correct HTTP verb')
          t.equal(req.url, '/Patient/1', 'should request the correct path')
          t.equal(req.headers['x-request-id'], requestId)
          body = JSON.parse(body)
          t.deepEqual(body, patient, 'should have the correct body')
          res.writeHead(200)
          res.end()
        })
      })
      const overrides = {
        headers: {
          'X-Request-Id': requestId
        }
      }
      client.update(patient, overrides, (err) => {
        t.error(err)
        t.end()
      })
    })

    t.test('delete', (t) => {
      server.once('request', (req, res) => {
        t.equal(req.method, 'DELETE', 'should use the correct HTTP verb')
        t.equal(req.url, '/Patient/1', 'should request the correct path')
        res.writeHead(204)
        res.end()
      })
      client.delete('Patient', '1', (err) => {
        t.error(err)
        t.end()
      })
    })

    t.test('delete with overrides', (t) => {
      const requestId = 'b2653538-fe93-4da2-92d9-16e6efbfb779'
      server.once('request', (req, res) => {
        t.equal(req.method, 'DELETE', 'should use the correct HTTP verb')
        t.equal(req.url, '/Patient/1', 'should request the correct path')
        t.equal(req.headers['x-request-id'], requestId)
        res.writeHead(204)
        res.end()
      })
      const overrides = {
        headers: {
          'X-Request-Id': requestId
        }
      }
      client.delete('Patient', '1', overrides, (err) => {
        t.error(err)
        t.end()
      })
    })

    t.test('transaction', (t) => {
      const bundle = {
        title: 'Test Bundle',
        id: 'urn:uuid:066942ba-8e70-49a5-88d3-b1c9f92c4f1a',
        updated: (new Date()).toJSON(),
        entry: []
      }
      server.once('request', (req, res) => {
        let body = ''
        req.on('data', (data) => {
          body += data
        })
        req.on('end', () => {
          t.equal(req.method, 'POST')
          t.equal(req.url, '/')
          body = JSON.parse(body)
          t.deepEqual(body, bundle, 'should have the correct body')
          res.writeHead(200)
          res.end()
        })
      })
      client.transaction(bundle, (err) => {
        t.error(err)
        t.end()
      })
    })

    t.test('transaction with overrides', (t) => {
      const requestId = '387c2133-c703-4e60-a0d7-eb3564aad860'
      const bundle = {
        title: 'Test Bundle',
        id: 'urn:uuid:066942ba-8e70-49a5-88d3-b1c9f92c4f1a',
        updated: (new Date()).toJSON(),
        entry: []
      }
      server.once('request', (req, res) => {
        let body = ''
        req.on('data', (data) => {
          body += data
        })
        req.on('end', () => {
          t.equal(req.method, 'POST')
          t.equal(req.url, '/')
          t.equal(req.headers['x-request-id'], requestId)
          body = JSON.parse(body)
          t.deepEqual(body, bundle, 'should have the correct body')
          res.writeHead(200)
          res.end()
        })
      })
      const overrides = {
        headers: {
          'X-Request-Id': requestId
        }
      }
      client.transaction(bundle, overrides, (err) => {
        t.error(err)
        t.end()
      })
    })

    t.test('search', (t) => {
      const query = {
        identifier: 'urn:uuid:7f9160ca-38b9-47d8-bf30-b44d1c5655b3|123',
        'provider:Patient': '321'
      }
      server.once('request', (req, res) => {
        t.equal(req.method, 'GET')
        const parsed = url.parse(req.url, true)
        t.equal(parsed.pathname, '/Patient')
        t.deepEqual(parsed.query, query)
        res.writeHead(200)
        res.end()
      })
      client.search('Patient', query, (err, res) => {
        t.error(err)
        t.equal(res.statusCode, 200)
        t.end()
      })
    })

    t.test('search with overrides', (t) => {
      const requestId = 'd9f23fcb-210a-48e8-94d6-8b6ab0e12d6c'
      const query = {}
      server.once('request', (req, res) => {
        t.equal(req.method, 'GET')
        t.equal(req.headers['x-request-id'], requestId)
        const parsed = url.parse(req.url, true)
        t.equal(parsed.pathname, '/Patient')
        t.deepEqual(parsed.query, query)
        res.writeHead(200)
        res.end()
      })
      const overrides = {
        headers: {
          'X-Request-Id': requestId
        }
      }
      client.search('Patient', query, overrides, (err, res) => {
        t.error(err)
        t.equal(res.statusCode, 200)
        t.end()
      })
    })

    t.end()
  })
})
