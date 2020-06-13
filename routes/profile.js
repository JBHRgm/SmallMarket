const router = require('express').Router();

router.get('/', function(req, res) {
    console.log(req.user);
    console.log(req.user['registered'].toLocaleString());
    return res.send("profile");
})

module.exports = router;