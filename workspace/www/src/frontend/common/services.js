import SocketService from './services/socket';
import UserService from './services/user';

angular.module('app.services', [])
  .service('SocketService', SocketService)
  .service('UserService', UserService);
