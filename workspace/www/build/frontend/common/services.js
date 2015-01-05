System.register("frontend/common/services", ["./services/socket", "./services/user"], function($__export) {
  "use strict";
  var __moduleName = "frontend/common/services";
  function require(path) {
    return $traceurRuntime.require("frontend/common/services", path);
  }
  var SocketService,
      UserService;
  return {
    setters: [function(m) {
      SocketService = m.default;
    }, function(m) {
      UserService = m.default;
    }],
    execute: function() {
      angular.module('app.services', []).service('SocketService', SocketService).service('UserService', UserService);
    }
  };
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJvbnRlbmQvY29tbW9uL3NlcnZpY2VzLmpzIiwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZXMiOlsiZnJvbnRlbmQvY29tbW9uL3NlcnZpY2VzLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTb2NrZXRTZXJ2aWNlIGZyb20gJy4vc2VydmljZXMvc29ja2V0JztcbmltcG9ydCBVc2VyU2VydmljZSBmcm9tICcuL3NlcnZpY2VzL3VzZXInO1xuXG5hbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJywgW10pXG4gIC5zZXJ2aWNlKCdTb2NrZXRTZXJ2aWNlJywgU29ja2V0U2VydmljZSlcbiAgLnNlcnZpY2UoJ1VzZXJTZXJ2aWNlJywgVXNlclNlcnZpY2UpO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9