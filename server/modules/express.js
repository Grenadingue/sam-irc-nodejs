function initExpress(express, app, folder)
{
  // Serve static files
  app.use(express.static(folder + '/www/html/'));
  app.use(express.static(folder + '/www/css/'));
  app.use(express.static(folder + '/www/js/'));

  // Serve jQuery
  app.get('/jquery/jquery.js', function (req, res) {
    res.sendFile(folder + '/node_modules/jquery/dist/jquery.min.js');
  });

  // Post requests
  app.post('/signup', function (req, res) {
    console.log('signup');
    res.redirect('/signin.html');
  });

  app.post('/signin', function (req, res) {
    console.log('signin');
    res.redirect('/index.html'); // redirect to irc
  });
}

module.exports = initExpress;
