const util = require("util");
const multer = require("multer");
const fs = require("fs");
const path = require('path');
const ARTICLE = require('../storage/Article');
const ART_PIC = require('../storage/Article-Pic');

var storage = multer.diskStorage({
  destination: async (req, file, callback) => {
    try {
        var aid = await ARTICLE.getMaxIndex() + 1;
    } catch (err) {
        console.log(err);
        return res.redirect('/');
    }
    callback(null, path.join(__dirname, `../public/img/articles/art${aid}`));
  },
  filename: async (req, file, callback) => {
    if (!file.mimetype.startsWith('image')) {
      var message = `Ungültige Datei!.`;
      return callback(message, null);
    }

    try {
        let aid = await ARTICLE.getMaxIndex() + 1;
        var filename = `art${aid}pic${req.body.ctr - 1}.jpg`;
    } catch (err) {
        throw (err);
    }

    callback(null, filename);
  }
});

var createFolder = async function (req, res, next) {
    try {
        let aid = await ARTICLE.getMaxIndex() + 1;
        console.log(aid);
        let foldername = path.join(__dirname, `../public/img/articles/art${aid}`);
        fs.mkdir(foldername, function(err) {
            if (err) {
                if (err.code != 'EEXIST') throw err;
            }
            next();
        }) 
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

var renameFolder = async function (old_p, new_p) {
    try {
        fs.rename(old_p, new_p, function(err) {
            if (err) throw(err);
            return 1;
        })
    } catch (err) {
        console.log(err);
        throw (err);
    }
}

var del = async function () {
    
}

var uploadFiles = multer({ storage: storage }).single("a-picture");
var uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = {
    mw_UploadFiles: uploadFilesMiddleware,
    mw_CreateFolder: createFolder,
    mw_RenameFolder: renameFolder,
    mw_Del: del
}