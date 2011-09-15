//

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