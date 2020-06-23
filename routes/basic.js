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
    let order = req.query['order'] || 'date-a';
    let page = req.query['page'] || 1;
    let price = [req.query['pl'], req.query['ph']];
    let count = 0;

    if (typeof loc == 'string') loc = [loc];
    if (typeof cat == 'string') cat = [cat];
    if (!parseInt(price[0])) price[0] = 0;
    if (!parseInt(price[1])) price[1] = 10000000;
    if (!parseInt(page)) page = 1;

    try {
        categories = await ARTCAT.catsANDcounts(search_str, price, loc);
        locations = await ARTICLE.locsANDcounts(search_str, price, cat, loc);
        articles = await ARTICLE.getArticles(search_str, loc, cat, order, price, page - 1);
        //console.log(articles);
        if (!locations) locations = [];
        else count = locations.pop();
    } catch (err) {
        console.log(err);
    }

    res.locals.search = search_str;
    res.locals.cat = cat;
    res.locals.loc = loc;
    res.locals.order = order;
    res.locals.count = count;
    res.locals.price = price;
    //console.log(res.locals);

    return res.render('index_own.html', { categories: categories, locations: locations, articles: articles });
});



module.exports = router;


