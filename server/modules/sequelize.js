function initSequelize(rootFolder)
{
  const Sequelize = require('sequelize');
  const conf = require(rootFolder + '/config/sequelize.config.json');
  const usersModel = require(rootFolder + '/models/Users.js');
  const orm = {
    sequelize: null,
    Users: null,
  };

  orm.sequelize = new Sequelize(conf.database, conf.username, conf.password, {
    host: conf.host,
    dialect: conf.dialect,
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
  });

  orm.Users = usersModel.init(orm, Sequelize);

  return orm;
}

module.exports = initSequelize;
