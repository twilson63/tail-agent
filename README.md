# tail-agent

A agent process that tails a json log file and puts
it to a simple kv database.

## usage

``` sh
agent /var/log/foo.log --port=6000 --host=localhost --secret=foo
```

## setup

First make sure you are running a skv datastore:

``` sh
npm install skv -g
skv 4444 --secret=foo
```

Next run your agent which will watch the designated log file

``` sh
agent /var/log/myapp.log --port=4444 --secret=foo
```
