# dnode-worker

Stupid simple workers for DNode

## Installation

`npm install dnode-worker`

## Example usage

worker.js:

```javascript
exports.multiply = function (a, b, callback) {
  callback(a * b)
}

exports.reallySlowTask = function (callback) {
  var array = []
  for (var i = 0; i < 70000; i++) {
    array = array.concat([i])
  }
  callback()
}
```

Your app.js:

```javascript
var Worker = require('./dnode-worker').Worker

Worker(__dirname + '/simple-worker', function (worker) {
  worker.multiply(5, 5, function (results) {
    console.log('results:', results)
  })
  worker.reallySlowTask(function () {
    console.log('done with the slow task')
    worker.exit()
  })
})

setInterval(function () {
  console.log('not blocking :)')
}, 1000)
```
