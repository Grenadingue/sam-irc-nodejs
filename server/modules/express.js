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
  });

  // Post requests
  app.post('/sign-in',
    passport.authenticate('local', {
      successRedirect: '/irc.html',
      failureRedirect: '/index.html',
    })
  );

  app.post('/sign-up',
    passport.createUser(orm, {
      successRedirect: '/index.html',
      failureRedirect: '/index.html',
    })
  );
}

module.exports = initExpress;
