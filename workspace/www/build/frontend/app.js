System.register("frontend/app", ["./home/home", "./auth/auth", "./common/directives", "./common/services"], function($__export) {
  "use strict";
  var __moduleName = "frontend/app";
  function require(path) {
    return $traceurRuntime.require("frontend/app", path);
  }
  return {
    setters: [function(m) {}, function(m) {}, function(m) {}, function(m) {}],
    execute: function() {
      var $__0 = this;
      angular.module('app', ['ngResource', 'ui.router', 'app.directives', 'app.services', 'app.home', 'app.auth']).config(['$provide', '$resourceProvider', '$httpProvider', '$locationProvider', 'app.settings', (function($provide, $resourceProvider, $httpProvider, $locationProvider, settings) {
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');
        $resourceProvider.defaults.stripTrailingSlashes = false;
        $provide.decorator('$resource', (function($delegate) {
          var url = settings.apiUrl,
              args;
          if (url.substr(-1) === '/') {
            url = url.substr(0, url.length - 1);
          }
          return (function() {
            for (var args = [],
                $__1 = 0; $__1 < arguments.length; $__1++)
              args[$__1] = arguments[$__1];
            if (args[0].substr(-1) === '/') {
              args[0] = url + '/' + args[0];
            } else {
              args[0] = url + '/' + args[0] + '/';
            }
            if (args[2]) {
              for (var method in args[2]) {
                if (args[2].hasOwnProperty(method) && args[2][method].url) {
                  if (args[2][method].url.substr(-1) === '/') {
                    args[2][method].url = url + '/' + args[2][method].url;
                  } else {
                    args[2][method].url = url + '/' + args[2][method].url + '/';
                  }
                }
              }
            }
            return $delegate.apply($__0, args);
          });
        }));
        $httpProvider.defaults.useXDomain = true;
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
      })]).constant('app.settings', {
        apiUrl: 'http://api.multi-study.local',
        publicUrl: 'http://public.multi-study.local'
      });
      angular.element(document).ready((function() {
        if (window.location.hash === '#_=_') {
          window.location.hash = '#!';
        }
        angular.bootstrap(document, ['app']);
      }));
    }
  };
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJvbnRlbmQvYXBwLmpzIiwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZXMiOlsiZnJvbnRlbmQvYXBwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIEltcG9ydCBhcHAgbW9kdWxlc1xuaW1wb3J0ICcuL2hvbWUvaG9tZSc7XG5pbXBvcnQgJy4vYXV0aC9hdXRoJztcbmltcG9ydCAnLi9jb21tb24vZGlyZWN0aXZlcyc7XG5pbXBvcnQgJy4vY29tbW9uL3NlcnZpY2VzJztcblxuXG4vLyBSZWdpc3RlciBtYWluIG1vZHVsZVxuYW5ndWxhci5tb2R1bGUoJ2FwcCcsIFtcbiAgJ25nUmVzb3VyY2UnLFxuICAndWkucm91dGVyJyxcbiAgJ2FwcC5kaXJlY3RpdmVzJyxcbiAgJ2FwcC5zZXJ2aWNlcycsXG4gICdhcHAuaG9tZScsXG4gICdhcHAuYXV0aCdcbl0pXG4gIC5jb25maWcoW1xuICAgICckcHJvdmlkZScsXG4gICAgJyRyZXNvdXJjZVByb3ZpZGVyJyxcbiAgICAnJGh0dHBQcm92aWRlcicsXG4gICAgJyRsb2NhdGlvblByb3ZpZGVyJyxcbiAgICAnYXBwLnNldHRpbmdzJyxcbiAgICAoJHByb3ZpZGUsICRyZXNvdXJjZVByb3ZpZGVyLCAkaHR0cFByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlciwgc2V0dGluZ3MpID0+IHtcbiAgICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcbiAgICAgICRsb2NhdGlvblByb3ZpZGVyLmhhc2hQcmVmaXgoJyEnKTtcblxuICAgICAgJHJlc291cmNlUHJvdmlkZXIuZGVmYXVsdHMuc3RyaXBUcmFpbGluZ1NsYXNoZXMgPSBmYWxzZTtcblxuICAgICAgJHByb3ZpZGUuZGVjb3JhdG9yKCckcmVzb3VyY2UnLCAoJGRlbGVnYXRlKSA9PiB7XG4gICAgICAgIHZhciB1cmwgPSBzZXR0aW5ncy5hcGlVcmwsIGFyZ3M7XG5cbiAgICAgICAgaWYgKHVybC5zdWJzdHIoLTEpID09PSAnLycpIHtcbiAgICAgICAgICB1cmwgPSB1cmwuc3Vic3RyKDAsIHVybC5sZW5ndGggLSAxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAoLi4uYXJncykgPT4ge1xuICAgICAgICAgIGlmIChhcmdzWzBdLnN1YnN0cigtMSkgPT09ICcvJykge1xuICAgICAgICAgICAgYXJnc1swXSA9IHVybCArICcvJyArIGFyZ3NbMF07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFyZ3NbMF0gPSB1cmwgKyAnLycgKyBhcmdzWzBdICsgJy8nO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoYXJnc1syXSkge1xuICAgICAgICAgICAgZm9yICh2YXIgbWV0aG9kIGluIGFyZ3NbMl0pIHtcbiAgICAgICAgICAgICAgaWYgKGFyZ3NbMl0uaGFzT3duUHJvcGVydHkobWV0aG9kKSAmJiBhcmdzWzJdW21ldGhvZF0udXJsKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFyZ3NbMl1bbWV0aG9kXS51cmwuc3Vic3RyKC0xKSA9PT0gJy8nKSB7XG4gICAgICAgICAgICAgICAgICBhcmdzWzJdW21ldGhvZF0udXJsID0gdXJsICsgJy8nICsgYXJnc1syXVttZXRob2RdLnVybDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgYXJnc1syXVttZXRob2RdLnVybCA9IHVybCArICcvJyArIGFyZ3NbMl1bbWV0aG9kXS51cmwgKyAnLyc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiAkZGVsZWdhdGUuYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgIH07XG4gICAgICB9KTtcblxuICAgICAgJGh0dHBQcm92aWRlci5kZWZhdWx0cy51c2VYRG9tYWluID0gdHJ1ZTtcbiAgICAgICRodHRwUHJvdmlkZXIuZGVmYXVsdHMueHNyZkhlYWRlck5hbWUgPSAnWC1DU1JGVG9rZW4nO1xuICAgICAgJGh0dHBQcm92aWRlci5kZWZhdWx0cy54c3JmQ29va2llTmFtZSA9ICdjc3JmdG9rZW4nO1xuICAgICAgZGVsZXRlICRodHRwUHJvdmlkZXIuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bJ1gtUmVxdWVzdGVkLVdpdGgnXTtcbiAgICB9XSlcbiAgLmNvbnN0YW50KCdhcHAuc2V0dGluZ3MnLCB7XG4gICAgYXBpVXJsOiAnaHR0cDovL2FwaS5tdWx0aS1zdHVkeS5sb2NhbCcsXG4gICAgcHVibGljVXJsOiAnaHR0cDovL3B1YmxpYy5tdWx0aS1zdHVkeS5sb2NhbCdcbiAgfSk7XG5cblxuLy8gQm9vdHN0cmFwIGFwcFxuYW5ndWxhci5lbGVtZW50KGRvY3VtZW50KS5yZWFkeSgoKSA9PiB7XG4gIGlmICh3aW5kb3cubG9jYXRpb24uaGFzaCA9PT0gJyNfPV8nKSB7XG4gICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSAnIyEnO1xuICB9XG4gIGFuZ3VsYXIuYm9vdHN0cmFwKGRvY3VtZW50LCBbJ2FwcCddKTtcbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9