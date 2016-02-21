module.exports.cluster = require('cluster');

module.exports.init = function (rootFolder, clusterPort) {
  const cluster = module.exports.cluster;

  cluster.setupMaster({
    exec: rootFolder + '/controllers/helloWorker.js',
    args: [clusterPort],
    silent: false,
  });
};

module.exports.work = function (clientSocket, eventName) {
  const cluster = module.exports.cluster;
  const worker = cluster.fork();
  const workerSocket = require('socket.io-client')('http://localhost:8000');

  worker.on('listening', function (address) {
    console.log('Worker launched');
    workerSocket.emit('work', {});
  });

  workerSocket.on('job done', function (data) {
    console.log('Worker job done');
    clientSocket.emit(eventName, data);
    worker.destroy();
  });

  workerSocket.on('disconnect', function (data) {
    console.log('Worker disconnected');
  });
};
