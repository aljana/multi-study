import headerDirective from './directives/header/header';
import contentDirective from './directives/content/content';

angular.module('app.directives', [])
  .directive('appHeader', headerDirective)
  .directive('appContent', contentDirective);
