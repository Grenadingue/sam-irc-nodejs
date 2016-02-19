module.exports.init = function (orm, Sequelize) {
  orm.Users = orm.sequelize.define('users', {
    username: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    active: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  }, { freezeTableName: true });

  orm.Users.sync({ force: false });

  return orm.Users;
};
