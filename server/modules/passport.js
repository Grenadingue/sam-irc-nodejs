function createUserPromise(username, password, confirmation, orm) {
  return new Promise(function (fulfill, reject) {
    if (!username.length) reject('Empty username');
    else if (!password.length) reject('Empty password');
    else if (password !== confirmation) reject('Password and confirmation aren\'t the same');
    else {
      orm.Users.findByUsername(username)
        .then(function (user) {
          if (!user) {
            orm.Users.createUser(username, password)
              .then(function (user) {
                console.log(user.username + '|' + user.password + '|' + user.id);
                fulfill(user);
              }
            );
          } else {
            reject('User already exists');
          }
        }
      );
    }
  });
}

function initPassport(passport, LocalStrategy, orm)
{
  passport.use(new LocalStrategy(
    function (username, password, done) {
      console.log('User input = ' + username + ' | ' + password);
      orm.Users.findByUsername(username)
        .then(function (user) {
          if (!user) {
            return done(null, false, { message: 'Unkown username' });
          } else if (password != user.password) {
            return done(null, false, { message: 'Invalid password' });
          }

          console.log('Database = ' + user.username + ' | ' + user.password);
          return done(null, user);
        }
      );
    }
  ));

  passport.createUser = function (orm, data) {
    return function (req, res) {
      console.log('sign-up');
      createUserPromise(req.body.username, req.body.password, req.body.confirmation, orm)
        .then(function (user) {
          res.redirect(data.successRedirect);
        },

        function (error) {
          console.log(error);
          res.redirect(data.failureRedirect);
        }
      );
    };
  };

  passport.serializeUser(function (user, done) {
    console.log('passport.serializeUser');
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    console.log('passport.deserializeUser');
    orm.Users.findById(id).then(function (user) {
      if (user) return done(null, user);
      return done({ message: 'User id not found' }, user);
    });
  });
}

module.exports = initPassport;
