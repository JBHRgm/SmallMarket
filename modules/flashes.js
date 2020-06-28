require('connect-flash');

module.exports.flashMessage = function (req, res, next) {
    res.locals.flashes = req.flash();
    next();
}
