System.register("frontend/home/controllers/index", [], function($__export) {
  "use strict";
  var __moduleName = "frontend/home/controllers/index";
  function require(path) {
    return $traceurRuntime.require("frontend/home/controllers/index", path);
  }
  var IndexController;
  return {
    setters: [],
    execute: function() {
      IndexController = (function() {
        var IndexController = function IndexController($scope, socketService) {
          this.$scope = $scope;
          socketService.on('quiz:0', (function(message) {
            console.log(message);
          }));
        };
        return ($traceurRuntime.createClass)(IndexController, {}, {});
      }());
      IndexController.$inject = ['$scope', 'SocketService'];
      $__export('default', IndexController);
    }
  };
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJvbnRlbmQvaG9tZS9jb250cm9sbGVycy9pbmRleC5qcyIsIm5hbWVzIjpbXSwibWFwcGluZ3MiOiIiLCJzb3VyY2VzIjpbImZyb250ZW5kL2hvbWUvY29udHJvbGxlcnMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgSW5kZXhDb250cm9sbGVyIHtcbiAgY29uc3RydWN0b3IoJHNjb3BlLCBzb2NrZXRTZXJ2aWNlKSB7XG4gICAgdGhpcy4kc2NvcGUgPSAkc2NvcGU7XG5cbiAgICBzb2NrZXRTZXJ2aWNlLm9uKCdxdWl6OjAnLCAobWVzc2FnZSkgPT4ge1xuICAgICAgY29uc29sZS5sb2cobWVzc2FnZSk7XG4gICAgfSk7XG4gIH1cbn1cblxuSW5kZXhDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICdTb2NrZXRTZXJ2aWNlJ107XG5cbmV4cG9ydCBkZWZhdWx0IEluZGV4Q29udHJvbGxlcjtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==