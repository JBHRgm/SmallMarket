const router = require('express').Router();
const USER = require('../storage/User');
const ARTICLE = require('../storage/Article');
const {isAuthenticated} = require ('../modules/auth-redirect');
const mailval = require('email-validator');


router.get('/:name', async function(req, res) {
    let uname = req.params.name;
    let user, articles;
    try {
        if (req.user && req.user.name == uname) {
            articles = await ARTICLE.getUserArticles(req.user.id);
            let count = await ARTICLE.getOwnerArticleCount(req.user.id);
            return res.render('profile_own.html', { user: req.user , articles: articles, count: count });
        }
        else {  
            user = await USER.getUserByName(uname);
            if (!user) throw `User ${uname} has not been found!`;
            articles = await ARTICLE.getUserArticles(user[USER.COLS[0]]);
            let count = await ARTICLE.getOwnerArticleCount(user[USER.COLS[0]]);
            return res.render('profile.html', { puser: user, articles: articles, count: count, user: {} });
        }
        
    } catch (err) {
        console.log(err);
        return res.redirect('/');
    }
})


router.post('/:name', isAuthenticated , async function (req, res) {
    let u_name = req.params.name;
    let n_mail = req.body.mail;
    let n_tel = req.body.tel;
    let o_pw = req.body.oldpw;
    let n_pw = req.body.newpw;
    let c_pw = req.body.confpw;
    let ok = true;

    try {
        // check passwords
        if (n_pw.length > 0) {
            let check = await USER.login(req.user.mail, o_pw);
            if (!check) {
                req.flash('oldpw', 'Zum Festlegen eines neuen Passworts wird die Eingabe des Alten benötigt!');
                ok = false;
            }
            let rgx = /[a-zA-Z0-9+-/_]{6,15}/g;
            if (!rgx.test(n_pw)) {
                req.flash('newpw', 'Ungültige Eingabe!');
                ok = false;
            }
            if (n_pw != c_pw) {
                req.flash('confpw', 'Keine Übereinstimmung!');
                ok = false;
            }
        }


        // check mail
        if (n_mail.length > 0 && n_mail.length <= 40) {
            if(mailval.validate(n_mail) == false) {
                req.flash('mail', 'Ungültige Eingabe!');
                ok = false;
            }
            else {
                let taken = await USER.checkMail(n_mail, req.user.id);
                if(taken) {
                    req.flash('mail_taken', 'Die Mail "' + n_mail + '" ist leider schon vergeben.');
                    ok = false;
                }
            }
        }
        else {
            req.flash('mail', 'Ungültige Eingabe!');
            ok = false;
        }

        // check phone
        if(n_tel.length > 0) {
            rgx =/[0-9]{1,15}/g;
            if(n_tel.length > 15 || !rgx.test(n_tel)) {
                req.flash('phone', 'Ungültige Eingabe!');
                ok = false;
            }
        }

        if (!ok) {
            res.locals.data = [n_mail, n_tel];
            return res.redirect(req.originalUrl);
        }
    
        if (req.user && req.user.name == u_name) {
            await USER.changeContact(req.user.id, n_mail, n_tel);
            await USER.changePassword(req.user.id, n_pw);
            req.user.mail = n_mail;
            req.user.phone = n_tel;
            req.flash('success', 'Änderungen wurden übernommen.');
            return res.redirect(`/profile/${u_name}`);
        }
        else throw "Missing Permissions!";
    } catch (err) {
        console.log(err);
        return res.redirect('/');
    }
})

module.exports = router;