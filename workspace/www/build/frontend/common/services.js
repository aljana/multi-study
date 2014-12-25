System.register("frontend/common/services", ["./services/socket"], function($__export) {
  "use strict";
  var __moduleName = "frontend/common/services";
  function require(path) {
    return $traceurRuntime.require("frontend/common/services", path);
  }
  var SocketService;
  return {
    setters: [function(m) {
      SocketService = m.default;
    }],
    execute: function() {
      angular.module('app.services', []).service('SocketService', SocketService);
    }
  };
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJvbnRlbmQvY29tbW9uL3NlcnZpY2VzLmpzIiwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZXMiOlsiZnJvbnRlbmQvY29tbW9uL3NlcnZpY2VzLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTb2NrZXRTZXJ2aWNlIGZyb20gJy4vc2VydmljZXMvc29ja2V0JztcblxuYW5ndWxhci5tb2R1bGUoJ2FwcC5zZXJ2aWNlcycsIFtdKVxuICAuc2VydmljZSgnU29ja2V0U2VydmljZScsIFNvY2tldFNlcnZpY2UpO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9