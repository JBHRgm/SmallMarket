const router = require('express').Router();
const passport = require('../modules/passport-config');

router.get('/', function(req, res) {
    return res.render('login.html');
});
  
router.post('/', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), function(req, res) {
    return res.redirect('/');
});


module.exports = router;