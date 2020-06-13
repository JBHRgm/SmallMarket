const router = require('express').Router();
const USER = require('../storage/User');

router.get('/', async function (req, res) { 
    try {
        await USER.checkMail();
    } catch (err) {
        console.error(err);
        return process.exit(1);
    }
    return res.render('index.html');
});

module.exports = router;