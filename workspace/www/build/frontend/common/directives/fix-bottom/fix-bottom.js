System.register([], function($__export) {
  "use strict";
  return {
    setters: [],
    execute: function() {
      $__export('default', (function() {
        return {
          restrict: 'A',
          link: function(scope, element, attrs) {
            var scrollBot = function() {
              var target = document.getElementById(attrs.fixBottom);
              target.scrollTop = target.scrollHeight;
            };
            element[0].addEventListener('submit', scrollBot);
            scope.$on('$destroy', function() {
              element[0].removeEventListener('submit', scrollBot);
            });
          }
        };
      }));
    }
  };
});
//# sourceURL=frontend/common/directives/fix-bottom/fix-bottom.js
//# sourceMappingURL=../../../../frontend/common/directives/fix-bottom/fix-bottom.js.map