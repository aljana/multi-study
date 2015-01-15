System.register(["./directives/header/header", "./directives/content/content", "./directives/enter-submit/enter-submit", "./directives/fix-bottom/fix-bottom"], function($__export) {
  "use strict";
  var headerDirective,
      contentDirective,
      enterSubmitDirective,
      fixBottomDirective;
  return {
    setters: [function(m) {
      headerDirective = m.default;
    }, function(m) {
      contentDirective = m.default;
    }, function(m) {
      enterSubmitDirective = m.default;
    }, function(m) {
      fixBottomDirective = m.default;
    }],
    execute: function() {
      angular.module('app.directives', []).directive('appHeader', headerDirective).directive('appContent', contentDirective).directive('enterSubmit', enterSubmitDirective).directive('fixBottom', fixBottomDirective);
    }
  };
});
//# sourceURL=frontend/common/directives.js
//# sourceMappingURL=../../frontend/common/directives.js.map