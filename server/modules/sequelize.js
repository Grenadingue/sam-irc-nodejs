function initSequelize(Sequelize, Store, rootFolder)
{
  const conf = require(rootFolder + '/config/sequelize.config.json');
  const usersModel = require(rootFolder + '/models/Users.js');
  const orm = {
    Sequelize: Sequelize,
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

  orm.store = new Store(orm.sequelize);

  orm.Users = usersModel.init(orm, Sequelize);
  orm.Users.belongsTo(orm.store.Session, { foreignKeyConstraint: true });

  orm.sequelize.sync({ force: false });

  return orm;
}

module.exports = initSequelize;
