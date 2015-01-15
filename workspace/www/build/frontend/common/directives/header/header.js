System.register([], function($__export) {
  "use strict";
  return {
    setters: [],
    execute: function() {
      $__export('default', (function() {
        return {
          restrict: 'AE',
          scope: {},
          controller: ['$scope', 'UserService', (function($scope, userService) {
            $scope.userService = userService;
          })],
          templateUrl: '/www/frontend/common/directives/header/header.html'
        };
      }));
    }
  };
});
//# sourceURL=frontend/common/directives/header/header.js
//# sourceMappingURL=../../../../frontend/common/directives/header/header.js.map