class LoggerService {
  constructor(log, toastr) {
    this._log = log;
    this._toastr = toastr;
  }

  log(type, msg, title, mode) {
    msg = this.parse(msg);
    mode = mode || 0;

    // Log to console
    if (mode === LoggerService.MODES.ALL || mode === LoggerService.MODES.CONSOLE) {
      if (type === 'error') {
        if (msg.stack) {
          this._log.error(msg.name || title + ':', msg.message, msg.stack);
        } else {
          this._log.error(msg.name || title + ':', msg.message);
        }
      } else if (type === 'info') {
        this._log.info(msg.name || title + ':', msg.message);
      } else if (type === 'warn') {
        this._log.warn(msg.name || title + ':', msg.message);
      } else {
        this._log.log(msg.name || title + ':', msg.message);
      }
    }

    // Toastr
    if (mode === LoggerService.MODES.ALL || mode === LoggerService.MODES.TOASTR) {
      this._toastr[type](msg.toastr, title || null);
    }
  }

  parse(err) {
    var
      error = {},
      index;

    if (angular.isObject(err)) {
      if (err.data) {
        err = err.data;
      }

      if (err.error) {
        err = err.error;
      }

      if (err.constructor.name && err.constructor.name !== 'Object') {
        error.name = err.constructor.name;
      } else {
        error.name = 'Error';
      }

      error.status = err.status || err.statusCode || -1;

      if (err.message) {
        error.message = err.message.charAt(0).toUpperCase() + err.message.slice(1);
        error.toastr = error.message;
        if (error.toastr.charAt(error.toastr.length) !== '.') {
          error.toastr += '!';
        }
      }
      if (err.stack) {
        index = err.message ? err.stack.indexOf(' at ') : -1;
        var spaces = err.stack.slice(0, index);
        spaces = spaces.length - spaces.trim().length;
        if (index !== -1) {
          error.stack = '\n' + (new Array(spaces)).join(' ') + err.stack.slice(index);
        } else {
          error.stack = err.stack;
        }
      }
    } else {
      error.name = '';
      error.code = -1;
    }

    if (!error.message) {
      error.message = err;
    }

    if (!error.toastr) {
      error.toastr = err;
    }

    return error;
  }
}

LoggerService.MODES = {
  ALL: 0,
  CONSOLE: 1,
  TOASTR: 2
};

LoggerService.$inject = ['$log', 'toastr'];

export default LoggerService;
