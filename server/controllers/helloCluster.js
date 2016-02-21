module.exports.cluster = require('cluster');
module.exports.port = 8080;

module.exports.init = function (rootFolder, clusterPort, addonPath) {
  const cluster = module.exports.cluster;

  module.exports.port = clusterPort;
  cluster.setupMaster({
    exec: rootFolder + '/controllers/helloWorker.js',
    args: [clusterPort, addonPath],
    silent: false,
  });
};

module.exports.work = function (clientSocket, eventName) {
  const cluster = module.exports.cluster;
  const worker = cluster.fork();
  const workerSocket = require('socket.io-client')('http://localhost:' + module.exports.port);

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
