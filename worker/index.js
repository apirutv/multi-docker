const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});
const sub = redisClient.duplicate();

function fib(index) {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}

function calFib(index){
  console.log('calculating fib of ' + index + ' ...');
  result = fib(index);
  console.log('fib of ' + index + ' = ' + result);
  return result;
}

sub.on('message', (channel, message) => {
  redisClient.hset('values', message, calFib(parseInt(message)));
});
sub.subscribe('insert');
