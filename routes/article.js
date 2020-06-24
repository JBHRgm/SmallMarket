const router = require('express').Router();
const USER = require('../storage/User');
const CATEGORY = require('../storage/Category');
const ARTCAT = require('../storage/Article-Cat');
const ARTPIC = require('../storage/Article-Pic');
const ARTICLE = require('../storage/Article');
const {isAuthenticated} = require ('../modules/auth-redirect');
const upload = require('../modules/pic-upload');


router.get('/:id/del', isAuthenticated, async function (req, res) {
    let a_id = parseInt(req.params.id);
    if (a_id == NaN) return res.redirect(req.originalUrl);

    try {
        let owner = await ARTICLE.getOwner(a_id);
        if (owner == req.user.id) {
            await ARTICLE.deleteArticle(a_id);
        }
        else throw "Missing Permissions!";
    } catch (err) {
        console.log(err);
        return res.redirect('/');
    }
    return res.redirect('/profile/' + req.user.name);
})


router.get('/:id/:name', async function (req, res, next) { 
    let a_id = req.params.id || 0;
    let a_name = req.params.name == '' ? 0:req.params.name;

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


router.get('/new', isAuthenticated, async function (req, res) {
    try {
        var categories = await CATEGORY.getAllCategories();
    } catch (err) {
        console.log(err);
        return res.redirect('/');
    }
    return res.render('article_edit.html', { cats: categories });
})

router.post('/pic', isAuthenticated, upload.mw_CreateFolder, async function (req, res) {
    console.log("before");
    try {
        await upload.mw_UploadFiles(req, res);
    } catch (err) {
        console.log(err);
        return res.redirect('/');
    }
    console.log("after");
    return res.sendStatus(200);
})


router.post('/new', isAuthenticated, async function (req, res) {
    console.log("new route");
    return res.send("new route route");
})


module.exports = router;


