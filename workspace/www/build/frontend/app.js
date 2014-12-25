System.register("frontend/app", ["./home/home", "./common/services"], function($__export) {
  "use strict";
  var __moduleName = "frontend/app";
  function require(path) {
    return $traceurRuntime.require("frontend/app", path);
  }
  return {
    setters: [function(m) {}, function(m) {}],
    execute: function() {
      angular.module('app', ['ngResource', 'ui.router', 'app.services', 'app.home']).config(['$locationProvider', (function($locationProvider) {
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');
      })]);
      angular.element(document).ready((function() {
        if (window.location.hash === '#_=_') {
          window.location.hash = '#!';
        }
        angular.bootstrap(document, ['app']);
      }));
    }
  };
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJvbnRlbmQvYXBwLmpzIiwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZXMiOlsiZnJvbnRlbmQvYXBwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIEltcG9ydCBhcHAgbW9kdWxlc1xuaW1wb3J0ICcuL2hvbWUvaG9tZSc7XG5pbXBvcnQgJy4vY29tbW9uL3NlcnZpY2VzJztcblxuXG4vLyBSZWdpc3RlciBtYWluIG1vZHVsZVxuYW5ndWxhci5tb2R1bGUoJ2FwcCcsIFtcbiAgJ25nUmVzb3VyY2UnLFxuICAndWkucm91dGVyJyxcbiAgJ2FwcC5zZXJ2aWNlcycsXG4gICdhcHAuaG9tZSdcbl0pXG4gIC5jb25maWcoWyckbG9jYXRpb25Qcm92aWRlcicsICgkbG9jYXRpb25Qcm92aWRlcikgPT4ge1xuICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcbiAgICAkbG9jYXRpb25Qcm92aWRlci5oYXNoUHJlZml4KCchJyk7XG4gIH1dKTtcblxuLy8gQm9vdHN0cmFwIGFwcFxuYW5ndWxhci5lbGVtZW50KGRvY3VtZW50KS5yZWFkeSgoKSA9PiB7XG4gIGlmICh3aW5kb3cubG9jYXRpb24uaGFzaCA9PT0gJyNfPV8nKSB7XG4gICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSAnIyEnO1xuICB9XG4gIGFuZ3VsYXIuYm9vdHN0cmFwKGRvY3VtZW50LCBbJ2FwcCddKTtcbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9