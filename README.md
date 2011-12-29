# dnode-worker

Stupid simple workers for DNode

## Installation

`npm install dnode-worker`

## In two flavors:

### (simple) Passing an object (no scope retained, uses toSource and eval):

```javascript
var Worker = require('dnode-worker');

Worker({
  add: function (a, b, callback) {
    callback(a + b);
  }
}, function (worker, exit) {
  worker.add(1, 2, function (result) {
    console.log(result); // 3
  });
});

```

### (hard) Using a module file:

_simple-worker.js_

```javascript
exports.multiply = function (a, b, callback) {
  callback(a * b)
}

exports.aSlowTask = function (callback) {
  var array = []
  for (var i = 0; i < 70000; i++) {
    array = array.concat([i])
  }
  callback()
}

```

_app.js_

```javascript
var Worker = require('dnode-worker');

Worker.createWorker(__dirname + '/simple-worker', function (worker, exit) {
  worker.multiply(5, 5, function (result) {
    console.log(result); // 25
  });
  worker.aSlowTask(function () {
    // Exit the worker
    exit(); // or worker.exit()
  });
});

```

## Licence

MIT/X11

