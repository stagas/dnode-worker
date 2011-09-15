var worker = require(process.argv[2])
// you should probably define your own .exit function for cleaner exit
worker.exit = worker.exit || function () { process.exit.apply(this, arguments) }
require('./dnode-worker').createWorker(worker)