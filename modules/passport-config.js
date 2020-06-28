const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const USER = require('../storage/User');

passport.use(new LocalStrategy({
    usernameField: 'usermail',
    passwordField: 'userpassword'
    },
    async function(email, password, done) {
        const auth = await USER.login(email, password);
        if(!auth) return done(null, false, { message: "Ungültige Eingabedaten!" })
        else {
            const user = await USER.getUserByMail(email);
            return done(null, user);
        }
    }
));

passport.serializeUser(function(user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(async function(id, cb) {
    let user = await USER.getUserByID(id);
    cb(null, user);
});

module.exports = passport;


