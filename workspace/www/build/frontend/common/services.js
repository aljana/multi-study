System.register(["./services/logger", "./services/socket", "./services/user", "./services/cache", "./services/quiz"], function($__export) {
  "use strict";
  var LoggerService,
      SocketService,
      UserService,
      CacheService,
      QuizService;
  return {
    setters: [function(m) {
      LoggerService = m.default;
    }, function(m) {
      SocketService = m.default;
    }, function(m) {
      UserService = m.default;
    }, function(m) {
      CacheService = m.default;
    }, function(m) {
      QuizService = m.default;
    }],
    execute: function() {
      angular.module('app.services', []).service('CacheService', CacheService).service('LoggerService', LoggerService).service('SocketService', SocketService).service('UserService', UserService).service('QuizService', QuizService);
    }
  };
});
//# sourceURL=frontend/common/services.js
//# sourceMappingURL=../../frontend/common/services.js.map