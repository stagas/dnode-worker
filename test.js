//

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