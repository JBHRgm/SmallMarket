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


module.exports = {
    isAuthenticated,
    redirectHome
}