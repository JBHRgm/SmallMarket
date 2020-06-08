const router = require('express').Router();
const db = require('../storage');


router.get('/', function(req, res) {
    console.log("you made it here");
    let rw = db.getUsers();
    rw.each((err, doc) => {
        console.log(doc);
    })
    return res.send('register');
})

module.exports = router;