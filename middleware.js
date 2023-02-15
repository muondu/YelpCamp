module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo =  req.originalUrl
        req.flash('error', 'You must be signed in first!');
        // We have put return so this code runs before the code after
        return res.redirect('/login');
    }
    next();
}