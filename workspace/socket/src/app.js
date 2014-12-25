var server = require('http').createServer();
var io = require('socket.io')(server);
var redis = require('redis');
var client = redis.createClient(6379, 'localhost');
var q = require('q');

var deferred = q.defer();

client.select(4, function (err, res) {
  if (err) {
    deferred.reject(err);
  } else {
    deferred.resolve(res);
  }
});

deferred.promise.then(() => {
  client.psubscribe('quiz:*');

  io.on('connection', (socket) => {
    client.on('pmessage', (pattern, channel, message) => {
      console.log(channel);
      console.log(message);
      socket.emit(channel, message);
    });
  });

  server.listen(3001, () => {
    console.log('listening');
  });
});

