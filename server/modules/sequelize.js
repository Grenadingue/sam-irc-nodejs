function initSequelize(rootFolder)
{
  var Sequelize = require('sequelize');
  var conf = require(rootFolder + '/config/sequelize.config.json');

  return new Sequelize(conf.database, conf.username, conf.password, {
    host: conf.host,
    dialect: conf.dialect,
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
  });
}

module.exports = initSequelize;
