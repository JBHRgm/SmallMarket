const router = require('express').Router();
const USER = require('../storage/User');
const CATEGORY = require('../storage/Category');
const ARTCAT = require('../storage/Article-Cat');
const ARTPIC = require('../storage/Article-Pic');
const ARTICLE = require('../storage/Article');

router.get('/:id/:name', async function (req, res, next) { 
    let a_id = req.params.id || 0;
    let a_name = req.params.name == '' ? 0:req.params.name;
    console.log(req.params);
    a_id = parseInt(a_id);

    if (!a_id || !a_name) return next();
    
    try {
        var article = await ARTICLE.getArticle(a_id, a_name);
        if (!article) throw 'No Article found!';
        var owner = await USER.getUserByID(article[ARTICLE.COLS[5]]);
        if (!owner) throw 'Owner of this article cannot be found!';
        owner['count'] = await ARTICLE.getOwnerArticleCount(owner[USER.COLS[0]]);
        var pictures = await ARTPIC.getPictures(a_id);
    } catch (err) {
        console.log(err);
        return res.redirect('/');
    }

    return res.render('article.html', { article: article, owner: owner, pictures: pictures });
});

module.exports = router;


