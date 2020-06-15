const dotenv = require('dotenv').config();
const helmet = require('helmet');
const express = require('express');
const fav = require('serve-favicon');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./modules/passport-config');
const app = express();
const flash = require('connect-flash');
const flash_mw = require('./modules/flashes');
const db = require('./storage');

// if(process.env.DB_HOST != 'localhost'){
//   const redis = require('redis');
//   const redisClient = redis.createClient(process.env.REDIS_URL);
//   const redisStore = require('connect-redis')(session);
//   redisClient.on('error', (err) => {
//     console.log('redis error: ', err);
//     });
// }

if (dotenv.error) throw dotenv.error;

const IN_PROD = process.env.NODE_ENV === 'production';
const TTL = parseInt(process.env.SESS_LIFETIME);

// Helmet
app.use(helmet());

// Cookies
app.use(cookieParser());


// Session Authentication
app.use(
  session({
    name: process.env.SESS_NAME,
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESS_SECRET,
    cookie: {
      httpOnly: true,
      maxAge: TTL,
      sameSite: true,
      secure: IN_PROD,
    },
    rolling: true
    //store: new redisStore({client: redisClient}),
  })
);

// Serve Favicon
app.use(fav(path.join(__dirname,'public','templates','favicon.ico')));



// static folder where static files like html are stored
app.use('/static/', express.static('public', { index: false }));
// view folder for the template engine
app.set('views', __dirname + '/public/templates');
// set the template engine to be ejs
app.engine('html', require('ejs').renderFile);
// usage of .html files
app.set('view engine', 'html');

// support parsing of application/x-www-form-urlencoded post data
app.use(
  express.urlencoded({
    extended: true,
  })
);
// support parsing of application/json post data
app.use(express.json());

//passport
app.use(passport.initialize());
app.use(passport.session());


db.createConnection(process.env.DB_HOST, process.env.DB_PORT, process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_NAME)
.then(async () => {
  await db.createTables()
  console.log('Connected to MySQL Database.');
  app.listen(process.env.PORT, function () {
    console.log('******************************************************************');
    console.log(`SmallMarket app listening on port ${process.env.PORT}`);
    console.log('******************************************************************');
  })
})
.catch((err) => {
  console.error(err);
  process.exit(1);
})


// -------------------------------------------------------------------------------------------------------------------------------- Middleware
// flash middleware - allows to use req.flash()
app.use(flash());
app.use(flash_mw.flashMessage);

// auth middleware  - will redirect user to /login if he/she tries to access a secure route while not being authenticated
const isAuthenticated = function (req, res, next) {
  console.log("auth - " + req.originalUrl);
  if (req.user) return next();
  else return res.redirect('/login');
}

// home middleware - will redirect already authenticated users to /home if they try to access authentication routes like login or register
const redirectHome = function (req, res, next) {
  if(req.user) return res.redirect('/');
  else return next();
}

// -------------------------------------------------------------------------------------------------------------------------------- /Middleware

// -------------------------------------------------------------------------------------------------------------------------------- Routes

app.use('/', require('./routes/basic'));

app.use('/login', redirectHome, require('./routes/login'));

app.use('/register', redirectHome, require('./routes/register'));

app.use('/profile', isAuthenticated, require('./routes/profile'));

app.use('/logout', isAuthenticated, require('./routes/logout'));

//app.use('/settings', isAuthenticated, require('./routes/setting.js'));


// -------------------------------------------------------------------------------------------------------------------------------- /Routes

// app.use(function (req, res, next) {
//   res.setHeader('Cache-Control', 'no-cache, must-revalidate, no-store');
//   res.setHeader('Pragma', 'no-cache'); // HTTP 1.0.
//   res.setHeader('Expires', '0'); // Proxies.
//   next();
// });

// -------------------------------------------------------------------------------------------------------------------------------- Error handler
// handle error 404 - page not found
app.use('*', function (req, res) {
  return res.send('Seems like you ran into a 404 Error, do you know where to go?');
});

// handle any server error
app.use(function (err, req, res, next) {
  console.log('Error handler');
  console.error(err);
  return res.status(500).send({ error: err.message });
});
// -------------------------------------------------------------------------------------------------------------------------------- /Error handler


