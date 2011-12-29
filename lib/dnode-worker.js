/*
 * dnode worker
 */
 
// Dependencies
var dnode = require('dnode')
var toSource = require('tosource')

// Export createWorker
exports = module.exports = function createWorker (what, callback) {
  var fork = require('child_process').fork
  var path = require('path')
  var worker = fork(__dirname + '/dnode-worker-runner')
  var out = {}
  if ('string' == typeof what) {
    out.filename = path.resolve(what)
  } else if ('object' == typeof what) {
    out.source = toSource(what)
  } else {
    return callback(new Error('Unknown wrapper'))
  }
  worker.on('message', function (message) {
    dnode.connect(message, function (remote) {
      callback(remote, remote.exit)
    })
  })
  worker.on('error', function (err) {
    console.error(err)
  })
  worker.send(out)
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
    var worker = dnode(wrapper)
    worker.on('ready', function () {
      process.send(port)
      if (callback) {
        callback(null, worker)
      }
    })
    worker.listen(port)
  })
}
