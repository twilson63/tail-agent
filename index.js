// # logagent
//
// A nodejs app that watches a log file and
// uses dnode to push to the leveldb kv datastore
//
// ## usage
//
// agent --log=foo.log --host=[host] --port=[port] --secret=foo
//
var Tail = require('always-tail');
var upnode = require('upnode');
var uuid = require('uuid');
var validate = require('validate-options');
var _ = require('underscore');

module.exports = function(opts) {
  if (!validate(opts, ['log', 'port', 'secret'])) {
    console.log('foo');
    process.exit(0);
  }
  // setup skv connect info
  var connInfo = {
    host: opts.host || 'localhost',
    port: opts.port
  };
  // connect to skv
  upnode.connect(connInfo, function(remote) {
    if (!_(remote).has('auth')) {
      console.log('unable to connect!');
      process.exit(0);
    }
    remote.auth(opts.secret, ready);
  });

  // database ready
  function ready(err, db) {
    // if no connection then shutdown
    if (err) { console.log(err); process.exit(0); }
    // start watching log file
    var tail = new Tail(opts.log, '\n');
    tail.on('line', function (data) {
      try {
        var obj = JSON.parse(data);
        // add log entry to database
        db.put(uuid.v1(), obj);
      } catch (err) {
        console.log('not json');
        console.log(err);
      }
    });
    tail.on('error', function (err) {
      console.log(err);
    });
    tail.watch();
  }
};
