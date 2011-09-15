// dnode worker

var spawn = require('child_process').spawn
  , dnode = require('dnode')

exports.Worker = function Worker (filename, cb) {
  // todo: should replace with child_process.fork when it's stable
  var worker = spawn('node', [ __dirname + '/dnode-worker-runner', filename ])
  worker.stdout.setEncoding('utf8')
  worker.stdout.once('data', function (data) {
    dnode.connect(data.split('\n')[0], cb)
  })
}

exports.createWorker = function createWorker (obj) {
  var random = '/tmp/dnode-worker-' + Math.floor(Math.random() * Date.now()) + '.sock'
  var worker = dnode(obj)
  worker.on('ready', function () {
    console.log(random)
  })
  worker.listen(random)
}