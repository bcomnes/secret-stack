var tape = require('tape')
var Api  = require('../api')

tape('add a core api + a plugin', function (t) {

  var Create = Api([{
    init: function (api, opts) {
      t.deepEqual(opts, {okay: true})
      return {
        hello: function (name) {
          return 'Hello, ' + name + '.'
        }
      }
    }
  }])

  var api = Create({okay: true})

  t.equal(api.hello('Foo'), 'Hello, Foo.')

  Create.use({
    init: function (api, opts) {
      t.deepEqual(opts, {okay: true})
      api.hello.hook(function (greet, args) {
        var value = greet(args[0])
        return value.substring(0, value.length - 1) + '!!!'
      })
    }
  })

  var api2 = Create({okay: true})
  t.equal(api2.hello('Foo'), 'Hello, Foo!!!')
  t.end()
})

tape('named plugin', function (t) {

  //core, not a plugin.
  var Create = Api([{
    manifest: {
      hello: 'sync'
    },
    init: function (api) {
      return {
        hello: function (name) {
          return 'Hello, ' + name + '.'
        }
      }
    }
  }])

  console.log(Create)

  Create.use({
    name: 'foo',
    manifest: {
      goodbye: 'async'
    },
    init: function () {
      return {goodbye: function (n, cb) { cb(null, n) }}
    }
  })

  t.deepEqual(Create.manifest, {
    hello: 'sync',
    foo: {
      goodbye: 'async'
    }
  })

  t.end()
})

