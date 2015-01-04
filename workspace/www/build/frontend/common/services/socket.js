class SocketService {
  constructor($rootScope) {
    this.$rootScope = $rootScope;

    this.socket = io.connect('http://10.1.1.3:3001');
  }

  on(event, callback) {
    var self = this;
    self.socket.on(event, function() {
      var args = arguments;
      self.$rootScope.$apply(function() {
        callback.apply(self.socket, args);
      });
    });
  }

  emit(event, data, callback) {
    var self = this;
    self.socket.emit(event, data, function() {
      var args = arguments;
      self.$rootScope.$apply(function() {
        if (callback) {
          callback.apply(self.socket, args);
        }
      });
    });
  }
}

SocketService.$inject = ['$rootScope'];

export default SocketService;
