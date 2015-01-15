System.register([], function($__export) {
  "use strict";
  var CacheService;
  return {
    setters: [],
    execute: function() {
      CacheService = (function() {
        var CacheService = function CacheService(cookieStore, cacheFactory) {
          this.cacheFactory = cacheFactory;
          this.polyfill = {
            getItem: (function(key) {
              cookieStore.get(key);
            }),
            setItem: (function(key, value) {
              cookieStore.put(key, value);
            }),
            removeItem: (function(key) {
              cookieStore.remove(key);
            })
          };
        };
        return ($traceurRuntime.createClass)(CacheService, {create: function(name, options) {
            if (!options.storageMode) {
              options.storageMode = 'localStorage';
            }
            if (!window[options.storageMode]) {
              options.storageImpl = this.polyfill;
            }
            return this.cacheFactory(name, options);
          }}, {});
      }());
      CacheService.$inject = ['$cookieStore', 'DSCacheFactory'];
      $__export('default', CacheService);
    }
  };
});
//# sourceURL=frontend/common/services/cache.js
//# sourceMappingURL=../../../frontend/common/services/cache.js.map