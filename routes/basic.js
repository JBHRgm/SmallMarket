const router = require('express').Router();
const db = require('../storage');

router.get('/', async function (req, res) { 
    try {
        await db.registerUser('first', 'last', 'mail', 'pwd');
        let matches = await db.getAllUsers();
        console.log(matches);
        let one = await db.getUserByID(matches[0]['_id']);
    } catch (err) {
        console.log(err);
    }
    return res.render('index.html');
});

module.exports = router;