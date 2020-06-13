const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../storage');

passport.use(new LocalStrategy({
    usernameField: 'usermail',
    passwordField: 'userpassword'
    },
    async function(email, password, done) {
        const auth = await db.USER.login(email, password);
        if(!auth) return done(null, false, { message: "Ungültige Eingabedaten!" })
        else {
            const user = await db.USER.getUserByMail(email);
            return done(null, user);
        }
    }
));

passport.serializeUser(function(user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(async function(id, cb) {
    let user = await db.USER.getUserByID(id);
    cb(null, user);
});

module.exports = passport;


