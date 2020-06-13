const router = require('express').Router();

router.get('/', function(req, res) {
    return res.send("profile");
})


router.post('/', function(req, res) {
    
})

module.exports = router;