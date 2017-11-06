'use strict'

const Client = require('../lib/client')
const tap = require('tap')
const {Agent} = require('http')

tap.test('Client', (t) => {
  t.test('should allow no options', (t) => {
    const client = new Client()
    t.equal(client._options.path, '/')
    t.end()
  })

  t.test('should allow an http url for options', (t) => {
    const client = new Client('http://example.com:8080/fhir/')
    t.equal(client._options.protocol, 'http:')
    t.equal(client._options.hostname, 'example.com')
    t.equal(client._options.port, '8080')
    t.equal(client._options.path, '/fhir/')
    t.ok(client._options.agent.keepAlive)
    t.end()
  })

  t.test('should allow an https url for options', (t) => {
    const client = new Client('https://example.com:8080/fhir/')
    t.equal(client._options.protocol, 'https:')
    t.equal(client._options.hostname, 'example.com')
    t.equal(client._options.port, '8080')
    t.equal(client._options.path, '/fhir/')
    t.ok(client._options.agent.keepAlive)
    t.end()
  })

  t.test('should support using a custom agent', (t) => {
    const customAgent = new Agent()
    const client = new Client({
      protocol: 'http:',
      hostname: 'example.com',
      port: '8080',
      path: '/fhir/',
      agent: customAgent
    })
    t.equal(client._options.agent, customAgent)
    t.end()
  })

  t.test('should support using no agent', (t) => {
    const client = new Client({
      protocol: 'http:',
      hostname: 'example.com',
      port: '8080',
      path: '/fhir/',
      agent: false
    })
    t.equal(client._options.agent, false)
    t.end()
  })

  t.end()
})
