function initExpress(express, app, rootFolder)
{
  // Serve static files
  app.use(express.static(rootFolder + '/www/html/'));
  app.use(express.static(rootFolder + '/www/css/'));
  app.use(express.static(rootFolder + '/www/js/'));

  // Serve jQuery
  app.get('/jquery/jquery.js', function (req, res) {
    res.sendFile(rootFolder + '/node_modules/jquery/dist/jquery.min.js');
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
