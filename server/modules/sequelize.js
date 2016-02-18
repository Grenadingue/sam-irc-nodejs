function initSequelize(Sequelize)
{
  return new Sequelize('sam_irc', 'archy', 'bar', {
    host: 'localhost',
    dialect: 'mariadb',
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
  });
}

module.exports = initSequelize;
