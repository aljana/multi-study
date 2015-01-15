import headerDirective from './directives/header/header';
import contentDirective from './directives/content/content';
import enterSubmitDirective from './directives/enter-submit/enter-submit';
import fixBottomDirective from './directives/fix-bottom/fix-bottom';

angular.module('app.directives', [])
  .directive('appHeader', headerDirective)
  .directive('appContent', contentDirective)
  .directive('enterSubmit', enterSubmitDirective)
  .directive('fixBottom', fixBottomDirective);
