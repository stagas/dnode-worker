[![build status](https://secure.travis-ci.org/stagas/dnode-worker.png)](http://travis-ci.org/stagas/dnode-worker)
# dnode-worker

Stupid simple workers for DNode

## Installation

`npm install dnode-worker`

## In three flavors!

### Passing a function:

```javascript
Worker(function (remote, conn) {
  var crypto = require('crypto');
  this.hash = function (s, callback) {
    callback(crypto.createHash('sha1').update(s).digest('hex'));
  }
}, function (worker) {
  worker.hash('foo', function (result) {
    // Do something with the result

    // Exit worker
    worker.exit();
  });
});

```

### Passing an object:

```javascript
var Worker = require('dnode-worker');

Worker({
  add: function (a, b, callback) {
    callback(a + b);
  }
}, function (worker, exit) {
  worker.add(1, 2, function (result) {
    console.log(result); // 3

    // Exit worker
    exit(); // or worker.exit()
  });
});

```

### Using a module file:

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
    // Exit worker
    exit(); // or worker.exit()
  });
});

```

## Error handling:

```javascript
Worker.createWorker({
  throwTask: function () {
    throw new Error('Some error');
  }
}, function (worker, exit) {
  worker.throwTask();
}).on('error', function (err) { // Attach error listener
  // Handle error
  console.error(err.stack)

  // Exit worker
  this.exit();
});

```

## Licence

MIT/X11

