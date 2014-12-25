module.exports = function (gulp) {
  var gulpsync = require('gulp-sync')(gulp);
  var _ = require('lodash');

  function Task(name) {
    this.name = name;
    this.locked = false;
    this.vault = false;
    this.timestamp = null;
  }

  Task.prototype.lock = function () {
    this.locked = true;
    this.timestamp = new Date();
    this.vault = true;
  };

  Task.prototype.unlock = function () {
    this.locked = false;
  };

  function Scheduler(delay, timeout) {
    var self = this;
    self.timeout = timeout || 5000;
    self.tasks = {};
    self.queue = [];
    setInterval(function () {
      self.dispatch();
    }, delay || 1000);
  }

  Scheduler.prototype.dispatch = function (tasks) {
    var queue, temp, i, j;

    if (tasks) {
      this.schedule(tasks);
    }

    queue = _.cloneDeep(this.queue);

    for (i = 0; i < queue.length; i++) {
      if (_.isObject(queue[i])) {
        var locked = false, key;

        if (_.has(queue[i], 'sync')) {
          key = 'sync';
        } else {
          key = 'async';
        }

        temp = _.flatten(queue[i][key]);

        for (j = 0; j < temp.length; j++) {
          if (this.task(temp[j]).locked && ((new Date()) - this.task(queue[i]).timestamp) < this.timeout) {
            locked = true;
            break;
          }
        }

        if (!locked) {
          for (j = 0; j < temp.length; j++) {
            if (this.task(temp[j]).vault) {
              this.task(temp[j]).locked = true;
            }
          }
          gulp.start(gulpsync[key](queue[i][key]));
          this.queue.splice(i, 1);
        }
      } else {
        if (!this.task(queue[i]).locked || (this.task(queue[i]).timestamp && (new Date()) - this.task(queue[i]).timestamp) > this.timeout) {
          if (this.task(queue[i]).vault) {
            this.task(queue[i]).locked = true;
          }
          gulp.start(queue[i]);
          this.queue.splice(i, 1);
        }
      }
    }
  };

  Scheduler.prototype.register = function (name) {
    if (!this.tasks[name]) {
      this.tasks[name] = new Task(name);
    }
  };

  Scheduler.prototype.task = function (name) {
    this.register(name);
    return this.tasks[name];
  };

  Scheduler.prototype.schedule = function (tasks) {
    var temp;
    if (!_.isArray(tasks)) {
      tasks = [tasks];
    }
    for (var i = 0; i < tasks.length; i++) {
      if (_.isObject(tasks[i])) {
        temp = _.flatten(tasks[i]);
        for (var j = 0; j < temp.length; j++) {
          this.register(temp[i]);
        }
      } else {
        this.register(tasks[i]);
      }
    }
    this.queue.push.apply(this.queue, tasks);
  };

  Scheduler.create = function (delay) {
    return new Scheduler(delay);
  };

  return Scheduler;
};
