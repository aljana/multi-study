System.register("frontend/common/directives", ["./directives/header/header", "./directives/content/content"], function($__export) {
  "use strict";
  var __moduleName = "frontend/common/directives";
  function require(path) {
    return $traceurRuntime.require("frontend/common/directives", path);
  }
  var headerDirective,
      contentDirective;
  return {
    setters: [function(m) {
      headerDirective = m.default;
    }, function(m) {
      contentDirective = m.default;
    }],
    execute: function() {
      angular.module('app.directives', []).directive('appHeader', headerDirective).directive('appContent', contentDirective);
    }
  };
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJvbnRlbmQvY29tbW9uL2RpcmVjdGl2ZXMuanMiLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJmcm9udGVuZC9jb21tb24vZGlyZWN0aXZlcy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgaGVhZGVyRGlyZWN0aXZlIGZyb20gJy4vZGlyZWN0aXZlcy9oZWFkZXIvaGVhZGVyJztcbmltcG9ydCBjb250ZW50RGlyZWN0aXZlIGZyb20gJy4vZGlyZWN0aXZlcy9jb250ZW50L2NvbnRlbnQnO1xuXG5hbmd1bGFyLm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnLCBbXSlcbiAgLmRpcmVjdGl2ZSgnYXBwSGVhZGVyJywgaGVhZGVyRGlyZWN0aXZlKVxuICAuZGlyZWN0aXZlKCdhcHBDb250ZW50JywgY29udGVudERpcmVjdGl2ZSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=