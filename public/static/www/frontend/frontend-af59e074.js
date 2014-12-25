"format register";!function(e){function r(e){for(var r=[],t=0,n=e.length;n>t;t++)-1==f.call(r,e[t])&&r.push(e[t]);return r}function t(e,t,n,o){if("string"!=typeof e)throw"System.register provided no module name";var u;if("boolean"==typeof n)u={declarative:!1,deps:t,execute:o,executingRequire:n};else{if(t.length>0&&1!=n.length)throw"Invalid System.register form for "+e+". Declare function must take one argument.";u={declarative:!0,deps:t,declare:n}}u.name=e,l[e]||(l[e]=u),u.deps=r(u.deps),u.normalizedDeps=u.deps}function n(e,r){if(r[e.groupIndex]=r[e.groupIndex]||[],-1==f.call(r[e.groupIndex],e)){r[e.groupIndex].push(e);for(var t=0,o=e.normalizedDeps.length;o>t;t++){var u=e.normalizedDeps[t],i=l[u];if(i&&!i.evaluated){var a=e.groupIndex+(i.declarative!=e.declarative);if(void 0===i.groupIndex||i.groupIndex<a){if(i.groupIndex&&(r[i.groupIndex].splice(f.call(r[i.groupIndex],i),1),0==r[i.groupIndex].length))throw new TypeError("Mixed dependency cycle detected");i.groupIndex=a}n(i,r)}}}}function o(e){var r=l[e];r.groupIndex=0;var t=[];n(r,t);for(var o=!!r.declarative==t.length%2,u=t.length-1;u>=0;u--){for(var a=t[u],s=0;s<a.length;s++){var d=a[s];o?i(d):c(d)}o=!o}}function u(e){return p[e]||(p[e]={name:e,dependencies:[],exports:{},importers:[]})}function i(r){if(!r.module){var t=r.module=u(r.name),n=r.module.exports,o=r.declare.call(e,function(e,r){t.locked=!0,n[e]=r;for(var o=0,u=t.importers.length;u>o;o++){var i=t.importers[o];if(!i.locked){var a=f.call(i.dependencies,t);i.setters[a](n)}}return t.locked=!1,r});if(t.setters=o.setters,t.execute=o.execute,!t.setters||!t.execute)throw"Invalid System.register form for "+r.name;for(var a=0,c=r.normalizedDeps.length;c>a;a++){var s=r.normalizedDeps[a],m=l[s],v=p[s],h;v?h=v.exports:m&&!m.declarative?h={"default":m.module.exports,__useDefault:!0}:m?(i(m),v=m.module,h=v.exports):h=d(s),v&&v.importers?(v.importers.push(t),t.dependencies.push(v)):t.dependencies.push(null),t.setters[a]&&t.setters[a](h)}}}function a(e){var r,t=l[e];if(t)t.declarative?s(e,[]):t.evaluated||c(t),r=t.module.exports;else if(r=d(e),!r)throw"System Register: The module requested "+e+" but this was not declared as a dependency";return(!t||t.declarative)&&r&&r.__useDefault?r["default"]:r}function c(r){if(!r.module){var t={},n=r.module={exports:t,id:r.name};if(!r.executingRequire)for(var o=0,u=r.normalizedDeps.length;u>o;o++){var i=r.normalizedDeps[o],s=l[i];s&&c(s)}r.evaluated=!0;var d=r.execute.call(e,function(e){for(var t=0,n=r.deps.length;n>t;t++)if(r.deps[t]==e)return a(r.normalizedDeps[t])},t,n);d&&(n.exports=d)}}function s(r,t){var n=l[r];if(!n.evaluated&&n.declarative){t.push(r);for(var o=0,u=n.normalizedDeps.length;u>o;o++){var i=n.normalizedDeps[o];-1==f.call(t,i)&&(l[i]?s(i,t):d(i))}n.evaluated||(n.evaluated=!0,n.module.execute.call(e))}}function d(e){if(m[e])return m[e];var r=l[e];if(!r)throw"Module "+e+" not present.";o(e),s(e,[]),l[e]=void 0;var t=r.declarative?r.module.exports:{"default":r.module.exports,__useDefault:!0};return m[e]=t}var l={},f=Array.prototype.indexOf||function(e){for(var r=0,t=this.length;t>r;r++)if(this[r]===e)return r;return-1},p={},m={};return function(r,n){var o;"undefined"!=typeof o&&o.register?(n(o),o["import"](r)):(n(o={register:t,get:d,set:function(e,r){m[e]=r},newModule:function(e){return e},global:e}),d(r))}}("undefined"!=typeof window?window:global)("frontend/app",function(e){e.register("frontend/home/controllers/index",[],function(e){"use strict";function r(e){return $traceurRuntime.require("frontend/home/controllers/index",e)}var t="frontend/home/controllers/index",n;return{setters:[],execute:function(){n=function(){var e=function r(e,t){this.$scope=e,t.on("quiz:0",function(e){console.log(e)})};return $traceurRuntime.createClass(e,{},{})}(),n.$inject=["$scope","SocketService"],e("default",n)}}}),e.register("frontend/common/services/socket",[],function(e){"use strict";function r(e){return $traceurRuntime.require("frontend/common/services/socket",e)}var t="frontend/common/services/socket",n;return{setters:[],execute:function(){n=function(){var e=function r(e){this.$rootScope=e,this.socket=io.connect("http://10.1.1.3:3001")};return $traceurRuntime.createClass(e,{on:function(e,r){var t=this;t.socket.on(e,function(){var e=arguments;t.$rootScope.$apply(function(){r.apply(t.socket,e)})})},emit:function(e,r,t){var n=this;n.socket.emit(e,r,function(){var e=arguments;n.$rootScope.$apply(function(){t&&t.apply(n.socket,e)})})}},{})}(),n.$inject=["$rootScope"],e("default",n)}}}),e.register("frontend/home/home",["frontend/home/controllers/index"],function(e){"use strict";function r(e){return $traceurRuntime.require("frontend/home/home",e)}var t="frontend/home/home",n;return{setters:[function(e){n=e.default}],execute:function(){angular.module("app.home",[]).config(["$stateProvider",function(e){e.state("home",{url:"/",templateUrl:"//public.multi-study.local/static/www/frontend/home/templates/home-a23d4c6c.html",controller:n,controllerAs:"IndexController"})}])}}}),e.register("frontend/common/services",["frontend/common/services/socket"],function(e){"use strict";function r(e){return $traceurRuntime.require("frontend/common/services",e)}var t="frontend/common/services",n;return{setters:[function(e){n=e.default}],execute:function(){angular.module("app.services",[]).service("SocketService",n)}}}),e.register("frontend/app",["frontend/home/home","frontend/common/services"],function(e){"use strict";function r(e){return $traceurRuntime.require("frontend/app",e)}var t="frontend/app";return{setters:[function(e){},function(e){}],execute:function(){angular.module("app",["ngResource","ui.router","app.services","app.home"]).config(["$locationProvider",function(e){e.html5Mode(!0),e.hashPrefix("!")}]),angular.element(document).ready(function(){"#_=_"===window.location.hash&&(window.location.hash="#!"),angular.bootstrap(document,["app"])})}}})});