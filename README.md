# FHIR JSON Client
[![Build Status](https://travis-ci.org/bausmeier/fhir-json-client.svg?branch=master)](https://travis-ci.org/bausmeier/fhir-json-client)
[![codecov](https://codecov.io/gh/bausmeier/fhir-json-client/branch/master/graph/badge.svg)](https://codecov.io/gh/bausmeier/fhir-json-client)

# Example usage

```js
const Client = require('fhir-json-client')

const client = new Client('https://example.com:8080/fhir/')

client.read('Patient', '1', (err, response, patient) => {
  ...
})
```

# Client(options)

Arguments:

* `options` - A URL string or object

# Callbacks

The arguments passed to all of the callback functions are:

1. An error object or `null` if no error occurred.
2. A response object containing the `statusCode` and `headers` properties.
3. The response body as string or an object if the response contained JSON content.

# Methods

## read(resourceType, id[, options], callback)

Read the current state of a resource.

Arguments:

* `resourceType` - The type of resource to read.
* `id` - The id of the resource to read.
* `options` - An optional object containing options to merge into the request options. This can be used to set custom headers on the request.
* `callback` - The function to call once the interaction has completed.

## vread(resourceType, id, versionId[, options], callback)

Read the state of a specific version of a resource.

Arguments:

* `resourceType` - The type of resource to read.
* `id` - The id of the resource to read.
* `versionId` - The specific version of the resource to read.
* `options` - An optional object containing options to merge into the request options. This can be used to set custom headers on the request.
* `callback` - The function to call once the interaction has completed.

## create(resource[, options], callback)

Create a new resource with a server assigned id.

Arguments:

* `resource` - The resource object to create.
* `options` - An optional object containing options to merge into the request options. This can be used to set custom headers on the request.
* `callback` - The function to call once the interaction has completed.

## update(resource[, options], callback)

Update an existing resource by its id (or create it if it is new).

Arguments:

* `resource` - The resource object to update.
* `options` - An optional object containing options to merge into the request options. This can be used to set custom headers on the request.
* `callback` - The function to call once the interaction has completed.

## delete(resourceType, id[, options], callback)

Delete a resource.

Arguments:

* `resourceType` - The type of resource to delete.
* `id` - The id of the resource to delete.
* `options` - An optional object containing options to merge into the request options. This can be used to set custom headers on the request.
* `callback` - The function to call once the interaction has completed.

## transaction(bundle[, options], callback)

Update, create or delete a set of resources as a single transaction.

Arguments:

* `bundle` - The bundle object to submit.
* `options` - An optional object containing options to merge into the request options. This can be used to set custom headers on the request.
* `callback` - The function to call once the interaction has completed.

## search(resourceType, query[, options], callback)

Search the resource type based on some filter criteria.

Arguments:

* `resourceType` - The type of resource to search for.
* `query` - The filter criteria as an object.
* `options` - An optional object containing options to merge into the request options. This can be used to set custom headers on the request.
* `callback` - The function to call once the interaction has completed.
