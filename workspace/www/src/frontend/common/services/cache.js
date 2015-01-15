class CacheService {
  constructor(cookieStore, cacheFactory) {
    this.cacheFactory = cacheFactory;
    this.polyfill = {
      getItem: (key) => {
        cookieStore.get(key);
      },
      setItem: (key, value) => {
        cookieStore.put(key, value);
      },
      removeItem: (key) => {
        cookieStore.remove(key);
      }
    };
  }

  create(name, options) {
    if (!options.storageMode) {
      options.storageMode = 'localStorage';
    }
    if (!window[options.storageMode]) {
      options.storageImpl = this.polyfill;
    }
    return this.cacheFactory(name, options);
  }
}

CacheService.$inject = ['$cookieStore', 'DSCacheFactory'];

export default CacheService;
