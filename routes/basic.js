const router = require('express').Router();
const USER = require('../storage/User');
const CATEGORY = require('../storage/Category');
const ARTCAT = require('../storage/Article-Cat');

router.get('/', async function (req, res) { 
    let categories, articles;
    let search_str = req.query['search'] || '';
    let loc = req.query['loc'] || [];
    if(typeof loc == 'string') loc = [loc];
    console.log(req.query);
    try {
        categories = await ARTCAT.catsANDcounts(search_str, loc);
        console.log(categories);
    } catch (err) {
        console.log(err);
    }
    return res.render('index_own.html', {categories: categories});
});

module.exports = router;