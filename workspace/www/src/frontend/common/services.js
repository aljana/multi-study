import LoggerService from './services/logger';
import SocketService from './services/socket';
import UserService from './services/user';
import CacheService from './services/cache';
import QuizService from './services/quiz';

angular.module('app.services', [])
  .service('CacheService', CacheService)
  .service('LoggerService', LoggerService)
  .service('SocketService', SocketService)
  .service('UserService', UserService)
  .service('QuizService', QuizService);
