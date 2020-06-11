require('connect-flash');

module.exports.flashMessage = function (req, res, next) {
    res.locals.flashes = req.flash();
    next();
}

module.exports.myFlash = function (code) {
    switch(code) {
        case 1: ''
        case 2:
        case 3:
        case 4:
        case 5:
        default: return false;
    }
}