const router = require('express').Router();
const USER = require('../storage/User');
const CATEGORY = require('../storage/Category');
const ARTCAT = require('../storage/Article-Cat');
const ARTICLE = require('../storage/Article');

router.get('/', async function (req, res) { 
    let categories, locations, articles;
    let search_str = req.query['search'] || '';
    let loc = req.query['loc'] || [];
    let cat = req.query['cat'] || [];
    let order = req.query['order'] || 'date';

    if(typeof loc == 'string') loc = [loc];
    if(typeof cat == 'string') cat = [cat];

    console.log(req.query);

    try {
        categories = await ARTCAT.catsANDcounts(search_str, loc);
        locations = await ARTICLE.locsANDcounts(search_str, cat);
        articles = await ARTICLE.getArticles(search_str, loc, cat, order);
        //console.log(articles);
        if (!locations) locations = [];
    } catch (err) {
        console.log(err);
    }

    res.locals.search = search_str;
    res.locals.cat = cat;
    res.locals.loc = loc;
    res.locals.order = order;
    //console.log(res.locals);

    return res.render('index_own.html', { categories: categories, locations: locations, articles: articles });
});

module.exports = router;


