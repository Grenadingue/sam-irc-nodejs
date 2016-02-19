function initExpress(express, app, rootFolder, passport, orm)
{
  // Initialize passport for express and restore authentication state,
  // if any, from session
  app.use(passport.initialize());
  app.use(passport.session());

  // Serve static files
  app.use(express.static(rootFolder + '/www/html/'));
  app.use(express.static(rootFolder + '/www/css/'));
  app.use(express.static(rootFolder + '/www/js/'));

  // Serve jQuery
  app.get('/jquery/jquery.js', function (req, res) {
    res.sendFile(rootFolder + '/node_modules/jquery/dist/jquery.min.js');
  });

  // Get requests
  app.get('/irc.html', function (req, res) {
      res.render('irc', { user:  req.user });
    }
  );

  // Post requests
  app.post('/sign-in',
    passport.authenticate('local', {
      successRedirect: '/irc.html',
      failureRedirect: '/index.html',
    })
  );

  app.post('/sign-up',
    function signUpUser(req, res) {
      const username = req.body.username;
      const password = req.body.password;
      const confirmation = req.body.confirmation;

      console.log('sign-up');
      if (username.length && password.length && confirmation.length && password == confirmation) {
        orm.Users.findOne({
          attributes: ['username', 'password', 'id'],
          where: { username: username },
        }).then(function (user) {
          if (!user) {
            orm.Users
              .create({ username: username, password: password })
              .then(function (user) {
                console.log(user.get('username') + '|' + user.get('password') + '|' + user.get('id'));
                res.redirect('/index.html');
              }
            );
          } else {
            console.log('user already exists');
            res.redirect('/index.html');
          }
        });
      }
    }
  );
}

module.exports = initExpress;
