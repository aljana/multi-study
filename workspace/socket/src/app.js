var server = require('http').createServer();
var io = require('socket.io')(server);
var redis = require('redis');
var q = require('q');
var winston = require('winston');

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({colorize: 'true', level: 'debug'}),
  ]
});

var usernames = {};

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

    var emitter = client.on('pmessage', (pattern, channel, message) => {
      if (settings.workspace.environment === 'development') {
        logger.debug(channel + ' -> ' + message);
      }
      io.sockets.emit(channel, message);
    });

    io.on('connection', (socket) => {
      socket.join('quiz:public');


      socket.on('disconnect', () => {
        socket.disconnect();
        //emitter.removeAllListeners();
      });

      socket.on('chat-join', function (data) {
        socket.join('quiz:' + data.quizPk);
        io.sockets.in('quiz:' + data.quizPk).emit('chat', {
          action: 'chat-join',
          email: data.email
        });
        logger.debug(data.email + ' joined room ' + 'quiz:' + data.quizPk);
      });

      socket.on('chat-message', function (data) {
        io.sockets.in('quiz:' + data.pk).emit('chat', {
          action: 'chat-message',
          email: data.email,
          message: data.message
        });
        logger.debug(data.email + ' sent message in room ' + 'quiz:' + data.pk);
      });


    });


    server.listen(settings.app.port, () => {
      console.log('Listening on port ' + settings.app.port + '...');
    });
  });
};





