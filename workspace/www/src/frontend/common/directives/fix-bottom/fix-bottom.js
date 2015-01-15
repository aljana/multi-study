export default () => {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var scrollBot = function () {
        var target = document.getElementById(attrs.fixBottom);
        target.scrollTop = target.scrollHeight;
      };

      element[0].addEventListener('submit', scrollBot);

      scope.$on('$destroy', function () {
        element[0].removeEventListener('submit', scrollBot);
      });
    }
  };
};
