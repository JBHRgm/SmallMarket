const router = require('express').Router();
const USER = require('../storage/User');
const xreg = require('xregexp');
const fs = require('fs');
const csv = require('csv-parser');
const mailval = require('email-validator');


// ----------------------------------------------------------------------------------------------------- Validation function
const validate = async function (req, res, next) {
    let name = req.body['username'].trim() || [];
    let plz = req.body['plz'].trim() || [];
    let city = req.body['city'].trim() || [];
    let mail = req.body['mail'].trim() || [];
    let phone = req.body['phone'].trim() || [];
    let pwd = req.body['password'].trim() || [];
    let conf = req.body['confirmpwd'].trim() || [];
    let ok_flag = true;

    try {
        // ----------------------------------------------------------------------------------------------------- BACKEND VALIDATION - because frontend validation can easily be bypassed
        let rgx = xreg('[a-zA-Z0-9+-/_]{6,15}', 'g');
        // check passwords, pattern is already checked in frontend, but backend validation must be done 
        if (pwd.length < 16) {          // check length limitation first, regex testing becomes time consuming on long inputs
            if (rgx.test(pwd) == false) { 
                req.flash('password', 'Passwort erfüllte nicht die erforderlichen Bedingungen!'); 
                ok_flag = false; 
            }
            if (conf != pwd) { 
                req.flash('confirmpwd', 'Passwörter stimmten nicht überein!'); 
                ok_flag = false; 
            }
        } else {
            req.flash('password', 'Passwort erfüllte nicht die erforderlichen Bedingungen!'); 
            ok_flag = false; 
        }
        
        
        // check username, should be between 5 and 25 in length and not contain whitespaces
        if (name.length > 25 || name.length < 5) {
            req.flash('username', 'Ungültige Eingabe!'); 
            ok_flag = false;
        }
        else {
            if(name.search(/\s/) >= 0) {
                req.flash('username', 'Ungültige Eingabe!'); 
                ok_flag = false;
            }
            else if (await USER.checkUsername(name)) {
                req.flash('username_taken', 'Der Benutzername ' + name + ' ist leider schon vergeben.'); 
                ok_flag = false;
            }
        }

        // check address, plz should be 5 digits, city cannot be empty, street wont be checked, number should be an integer (if filled)
        if (plz.length <= 5) {
            rgx = xreg('[0-9]{5}', 'g');
            if (rgx.test(plz) == false) { 
                req.flash('plz', 'Ungültige Eingabe!'); 
                ok_flag = false; 
            }
            else {
                let cities = await queryPLZ(plz);
                let cfl = false;
                for (ctr = 0; ctr < cities.length; ctr++) {
                    if (cities[ctr] == city) cfl = true;
                }
                if(!cfl) {
                    req.flash('city', 'Diese Stadt ist nicht zugehörig zu der angegebenen Postleitzahl!');
                    ok_flag = false;
                }
            }
        } else {
            req.flash('plz', 'Ungültige Eingabe!'); 
            ok_flag = false; 
        }
        
        // check mail, using npm module email-validator because email regexp looks disgusting (personal preference), disadvantage: another dependency
        if (mail.length > 0 && mail.length <= 40) {     // restrict mail to 40 characters, regex performance reasons mentioned earlier
            if(mailval.validate(mail) == false) {
                req.flash('mail', 'Ungültige Eingabe!');
                ok_flag = false;
            }
            else {
                let taken = await USER.checkMail(mail);
                if(taken) {
                    req.flash('mail_taken', 'Die Mail "' + mail + '" ist leider schon vergeben.');
                    ok_flag = false;
                }
            }
        }

        // check phone
        if(phone.length > 0) {
            rgx = xreg('[0-9]{1,15}', 'g');
            if(phone.length > 15) {
                req.flash('phone', 'Ungültige Eingabe!');
                ok_flag = false;
            }
            else if (rgx.test(phone) == false) {
                req.flash('phone', 'Ungültige Eingabe!');
                ok_flag = false;
            }
        }

        // redirect
        if(ok_flag) return next();
        else return res.redirect(req.originalUrl);

    } catch (err) {
        console.log(err);
        return process.exit(1);
    }
}

// ------------------------------------------------------------------------------------------------------------- Route Handlers
// GET /register
router.get('/', function(req, res) {
    return res.render('register.html');
})

// GET /register/plz
router.get('/plz', async function(req, res) {
    let plz = req.query.plz;
    let ret = await queryPLZ(req.query.plz);
    return res.json(ret);
})

// POST /register
router.post('/', validate, async function(req, res) {
    let name = req.body['username'].trim();
    let mail = req.body['mail'].trim();
    let phone = req.body['phone'].trim();
    let pwd = req.body['password'].trim();
    let address = req.body['plz'].trim() + ' ' + req.body['city'].trim();

    try {
        await USER.registerUser(name, mail, pwd, address, phone);
        return res.redirect('/login');
    } catch (err) {
        console.log(err);
        return process.exit(1);
    }
})

module.exports = router;


// little gimmick function that returns some of the districts of the corresponding postal code
// had this idea because i was too lazy to come up with a regexp for german cities
async function queryPLZ(plz) {
    return new Promise((resolve, reject) => {
        let ort = [];
        fs.createReadStream('./storage/postleitzahlen.csv')
        .pipe(csv())
        .on('data', (data) => {
            if(data.plz == plz) {
                ort.push(data.ort);
            }
        })
        .on('end', () => {
            resolve(ort);
        })
    }) 
}


