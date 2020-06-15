const router = require('express').Router();
const passport = require('../modules/passport-config');

router.get('/', function(req, res) {
    console.log(res.locals);
    return res.render('login.html');
});
  
router.post('/', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), function(req, res) {
    return res.redirect('/authenticated');
});


module.exports = router;