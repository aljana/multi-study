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

  var rclient = redis.createClient(
    settings.workspace.databases.redis4.port,
    settings.workspace.databases.redis4.host
  );

  var deferrers = [q.defer(), q.defer()];
  var promises = [deferrers[0].promise, deferrers[1].promise];

  rclient.select(settings.workspace.databases.redis4.db, function (err, res) {
    if (err) {
      deferrers[0].reject(err);
    } else {
      deferrers[0].resolve(res);
    }
  });

  client.select(settings.workspace.databases.redis4.db, function (err, res) {
    if (err) {
      deferrers[1].reject(err);
    } else {
      deferrers[1].resolve(res);
    }
  });

  q.all(promises).then(() => {
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

        rclient.get('quiz:chat:' + data.quizPk, (err, messages) => {
          io.sockets.in('quiz:' + data.quizPk).emit('chat', {
            action: 'chat-join',
            email: data.email,
            messages: messages ? JSON.parse(messages) : []
          });
          logger.debug(data.email + ' joined room ' + 'quiz:' + data.quizPk);

        });
      });

      socket.on('chat-message', function (data) {
        rclient.get('quiz:chat:' + data.pk, (err, messages) => {
          if (!messages) {
            messages = [];
          } else {
            messages = JSON.parse(messages);
          }

          messages.push({
            email: data.email,
            message: data.message
          });

          rclient.set('quiz:chat:' + data.pk, JSON.stringify(messages));
        });

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





