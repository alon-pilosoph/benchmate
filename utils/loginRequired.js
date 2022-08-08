// Middleware that makes suer user is authenticated
module.exports.loginRequired = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.next = req.originalUrl;
        req.flash('danger', 'You must be logged in to do that');
        return res.redirect('/login');
    }
    next();
}