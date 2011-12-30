var Worker = require('../')
var test = require('tap').test

test("createWorker(filename)", function (t) {
  t.plan(5)
  Worker.createWorker(__dirname + '/simple-worker', function (worker, exit) {
    t.equals('object', typeof worker, "worker is object")
    t.equals('function', typeof worker.exit, "worker.exit is function")
    t.equals('function', typeof exit, "exit is function")
    worker.multiply(5, 5, function (result) {
      t.equals(25, result, "5 x 5 = 25")
    })
    worker.aSlowTask(function () {
      t.pass("slow task done")
      exit()
    })
  })
})

test("Worker(object)", function (t) {
  t.plan(1)
  Worker({
    divide: function (a, b, callback) {
      callback(a / b)
    }
  }, function (worker) {
    worker.divide(25, 5, function (result) {
      t.equals(5, result, "25 / 5 = 5")
      worker.exit()
    })
  })
})

test("createWorker(filename) with error", function (t) {
  t.plan(1)
  Worker.createWorker(__dirname + '/simple-worker', function (worker, exit) {
    worker.throwTask()
  }).on('error', function (err) {
    t.throws(err, "error received")
    this.exit()
  })
})

test("createWorker(object) with error", function (t) {
  t.plan(1)
  Worker.createWorker({
    throwTask: function () {
      throw new Error('Some error')
    }
  }, function (worker, exit) {
    worker.throwTask()
  }).on('error', function (err) {
    t.throws(err, "error received")
    this.exit()
  })
})
