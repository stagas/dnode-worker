/*
 * dnode worker
 */

// Dependencies
var dnode = require('dnode')
var toSource = require('tosource')

// Reference to error types by name
var errors = {
  'EvalError': EvalError
, 'RangeError': RangeError
, 'ReferenceError': ReferenceError
, 'SyntaxError': SyntaxError
, 'TypeError': TypeError
, 'URIError': URIError
}

// Export createWorker
exports = module.exports = function createWorker (what, callback) {
  var fork = require('child_process').fork
  var path = require('path')
  var worker = fork(path.join(__dirname, 'runner'))
  var out = {}
  if ('string' == typeof what) {
    out.filename = path.resolve(what)
  } else if ('object' == typeof what) {
    out.source = toSource(what)
  } else {
    throw new Error('Unknown wrapper type')
  }
  worker.on('message', function (message) {
    if (message.port) {
      dnode.connect(message.port, function (remote, conn) {
        worker.exit = remote.exit
        callback(remote, remote.exit)
      })
    } else if (message.error) {
      var err = (errors[message.error.name] || Error)(message.error.message)
      err.stack = message.error.stack
      worker.emit('error', err)
    }
  })
  worker.send(out)
  return worker
}

// Reexport as method
exports.createWorker = module.exports

// Runs the worker
exports.runWorker = function runWorker (callback) {
  var port = Math.floor(Math.random() * 10000) + 10000
  process.on('message', function (message) {
    var wrapper
    if (message.filename) {
      wrapper = require(message.filename)
    } else if (message.source) {
      wrapper = eval('(' + message.source + ')')
    }
    wrapper.exit = wrapper.exit || function () { process.exit() }
    var server = dnode(wrapper)
    server.use(function (remote, conn) {
      conn.on('error', server.emit.bind(server, 'error'))
    })
    server.on('ready', function () {
      process.send({ port: port })
    })
    server.on('error', function (err) {
      // Serialize error
      process.send({
        error: {
          name: err.name
        , message: err.message
        , stack: err.stack
        }
      })
    })
    server.listen(port)
    if (callback) callback(server)
  })
}
