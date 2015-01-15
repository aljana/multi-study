System.register([], function($__export) {
  "use strict";
  var SocketService;
  return {
    setters: [],
    execute: function() {
      SocketService = (function() {
        var SocketService = function SocketService($rootScope, settings) {
          this.$rootScope = $rootScope;
          this.socket = io.connect(settings.socketUrl);
        };
        return ($traceurRuntime.createClass)(SocketService, {
          on: function(event, callback) {
            var self = this;
            self.socket.on(event, function() {
              var args = arguments;
              self.$rootScope.$apply(function() {
                callback.apply(self.socket, args);
              });
            });
          },
          emit: function(event, data, callback) {
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
        }, {});
      }());
      SocketService.$inject = ['$rootScope', 'settings'];
      $__export('default', SocketService);
    }
  };
});
//# sourceURL=frontend/common/services/socket.js
//# sourceMappingURL=../../../frontend/common/services/socket.js.map