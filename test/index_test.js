var test = require('tap').test;
var rewire = require('rewire');
var agent = rewire('../');
var opts = {log: 'foo.log', port: 1234, secret: 'foo'};

test('logagent on new line try to write to skv', function(t) {
  agent.__set__('upnode', {
    connect: function(conn, cb) {
      cb({
        auth: function(secret, cb) {
          process.nextTick(function() {
            cb(null, {
              put: function(key, data) {
                t.ok(true, 'succesfully sent rec');
                t.end();
              }
            });
          });
        }
      });
    }
  });

  agent.__set__('Tail', function(log, sep) {
    var cb;
    return {
      on: function (str, fn) {
        if (str === 'line') cb = fn;
      },
      watch: function() {
        cb('{"hello": "world"}');
      }
    };
  });
  agent(opts);
});
