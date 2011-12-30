exports.multiply = function (a, b, callback) {
  callback(a * b)
}

exports.aSlowTask = function (callback) {
  var array = []
  for (var i = 0; i < 30000; i++) {
    array = array.concat([i])
  }
  callback()
}

exports.throwTask = function (callback) {
  throw new Error('Some error')
}
