const router = require('express').Router();
const CHAT = require('../storage/Chat');


router.get('/', async function (req, res) {
    let aid = req.query.aid;
    let uid = req.query.uid;

    if (aid && uid) {
        try {
            let chat_messages = await CHAT.getChatMessages(uid, aid);
            return res.json({ messages: chat_messages, user: req.user.id });
        } catch (err) {
            console.log(err);
            return res.sendStatus(500);
        }
    }
    else {
        try {
            var open_chats = await CHAT.getOpenChats(req.user.id);
        } catch (err) {
            console.log(err)
            return res.redirect('/');
        }
        return res.render('chat.html', { user: {id: req.user.id, name: req.user.name}, openchats: open_chats });
    }
})

router.post('/', async function (req, res) {
    let aid = req.body.aid;
    let uid = req.body.uid;
    let msg = req.body.msg;
    try {
        let message = await CHAT.sendMessage(aid, req.user.id, uid, msg);
        return res.json({ message: message, user: req.user.id });
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
})

module.exports = router;