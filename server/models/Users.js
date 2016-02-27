module.exports.init = function (orm, Sequelize) {
  orm.Users = orm.sequelize.define('users', {
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
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

  orm.Users.findByUsername = function (username) {
    return orm.Users.findOne({ where: { username: username } });
  };

  orm.Users.findById = function (id) {
    return orm.Users.findOne({ where: { id: id } });
  };

  orm.Users.createUser = function (username, password) {
    return orm.Users.create({ username: username, password: password, active: false });
  };

  return orm.Users;
};
