System.register("frontend/common/services/socket", [], function($__export) {
  "use strict";
  var __moduleName = "frontend/common/services/socket";
  function require(path) {
    return $traceurRuntime.require("frontend/common/services/socket", path);
  }
  var SocketService;
  return {
    setters: [],
    execute: function() {
      SocketService = (function() {
        var SocketService = function SocketService($rootScope) {
          this.$rootScope = $rootScope;
          this.socket = io.connect('http://10.1.1.3:3001');
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
      SocketService.$inject = ['$rootScope'];
      $__export('default', SocketService);
    }
  };
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJvbnRlbmQvY29tbW9uL3NlcnZpY2VzL3NvY2tldC5qcyIsIm5hbWVzIjpbXSwibWFwcGluZ3MiOiIiLCJzb3VyY2VzIjpbImZyb250ZW5kL2NvbW1vbi9zZXJ2aWNlcy9zb2NrZXQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgU29ja2V0U2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKCRyb290U2NvcGUpIHtcbiAgICB0aGlzLiRyb290U2NvcGUgPSAkcm9vdFNjb3BlO1xuXG4gICAgdGhpcy5zb2NrZXQgPSBpby5jb25uZWN0KCdodHRwOi8vMTAuMS4xLjM6MzAwMScpO1xuICB9XG5cbiAgb24oZXZlbnQsIGNhbGxiYWNrKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHNlbGYuc29ja2V0Lm9uKGV2ZW50LCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgc2VsZi4kcm9vdFNjb3BlLiRhcHBseShmdW5jdGlvbigpIHtcbiAgICAgICAgY2FsbGJhY2suYXBwbHkoc2VsZi5zb2NrZXQsIGFyZ3MpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBlbWl0KGV2ZW50LCBkYXRhLCBjYWxsYmFjaykge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBzZWxmLnNvY2tldC5lbWl0KGV2ZW50LCBkYXRhLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgc2VsZi4kcm9vdFNjb3BlLiRhcHBseShmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgY2FsbGJhY2suYXBwbHkoc2VsZi5zb2NrZXQsIGFyZ3MpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufVxuXG5Tb2NrZXRTZXJ2aWNlLiRpbmplY3QgPSBbJyRyb290U2NvcGUnXTtcblxuZXhwb3J0IGRlZmF1bHQgU29ja2V0U2VydmljZTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==