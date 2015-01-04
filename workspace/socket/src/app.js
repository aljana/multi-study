var server = require('http').createServer();
var io = require('socket.io')(server);
var redis = require('redis');
var q = require('q');

module.exports = (settings) => {
  var deferred = q.defer();
  var client = redis.createClient(
    settings.workspace.databases.redis4.port,
    settings.workspace.databases.redis4.host
  );

  client.select(settings.workspace.databases.redis4.db, function (err, res) {
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

    server.listen(settings.app.port, () => {
      console.log('Listening on port ' + settings.app.port + '...');
    });
  });
};





