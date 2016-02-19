function initPassport(passport, LocalStrategy, orm)
{
  passport.use(new LocalStrategy(
    function (username, password, done) {
      console.log('User input = ' + username + ' | ' + password);
      orm.Users.findOne({ where: { username: username } })
        .then(function (user) {
          if (user) {
            console.log('Database = ' + user.username + ' | ' + user.password);
          }

          if (!user) {
            return done(null, false, { message: 'Unkown username' });
          } else if (password != user.password) {
            return done(null, false, { message: 'Invalid password' });
          }

          return done(null, user);
        }
      );
    }
  ));

  passport.serializeUser(function (user, done) {
    console.log('passport.serializeUser');
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    console.log('passport.deserializeUser');
    orm.Users.findOne({ where: { id: id } }).then(function (user) {
      if (user) return done(null, user);
      return done({ message: 'User id not found' }, user);
    });
  });
}

module.exports = initPassport;
