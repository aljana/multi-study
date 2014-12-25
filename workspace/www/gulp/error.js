module.exports = function (scheduler) {
  return function (task, log) {
    var gutil = require('gulp-util');
    return function (err) {
      if (!task && !log) {
        gutil.log(err.message);
        return;
      }
      if (task) {
        scheduler.task(task).unlock();
      }
      if (log !== false) {
        gutil.log(err.message);
      }
    };
  };
};
