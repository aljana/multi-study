System.register([], function($__export) {
  "use strict";
  return {
    setters: [],
    execute: function() {
      $__export('default', (function() {
        return {
          restrict: 'A',
          link: (function(scope, elem, attrs) {
            elem.bind('keydown', function(event) {
              var code = event.keyCode || event.which;
              if (code === 13) {
                if (!event.shiftKey) {
                  event.preventDefault();
                  scope.$apply(attrs.enterSubmit);
                }
              }
            });
          })
        };
      }));
    }
  };
});
//# sourceURL=frontend/common/directives/enter-submit/enter-submit.js
//# sourceMappingURL=../../../../frontend/common/directives/enter-submit/enter-submit.js.map