const passport = require('../config/passport');
const isAuthenticated = require('../config/middleware/isAuthenticated');
const authController = require('../controllers/authController');
const isEmailExists = require('../config/middleware/isEmailExists');
const isUsernameExists = require('../config/middleware/isUsernameExists');

const isAllowedLogin = require('../config/middleware/isAllowedLogin');

//const passport = require('../config/passport');

/*module.exports = function(app, passport){
    app.get('/signup', authController.signup);
    app.get('/signin', authController.signin);

    app.get('/signupSuccess', authController.signupSuccess);
    app.get('/signinSuccess', isLoggedIn, authController.signinSuccess);

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/signupSuccess',
        failureRedirect: '/signup'
    }));
    app.get('/logout', authController.logout);
    app.post('/signin', passport.authenticate('local-signin', {
        successRedirect: '/signinSuccess',
        failureRedirect: '/signin'
    }));

    function isLoggedIn(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        res.redirect('/signin');
    }
}*/

module.exports = function(app) {
    //app.get('/signup', authController.signup);
    //app.get('/teste', authController.signin);
    app.get('/signin', authController.signin);

    //app.get('/signupSuccess', authController.signupSuccess);
    app.get('/signinSuccess', isAuthenticated, authController.signinSuccess);

    app.post("/signup", isUsernameExists, isEmailExists, authController.signup);

    // Using the passport.authenticate middleware with our local strategy.
    // If the user has valid login credentials, send them to the members page.
    // Otherwise the user will be sent an error
    app.post('/signin', isAllowedLogin, passport.authenticate("local", {
        successRedirect: '/signinSuccess',
        failureRedirect: '/signin'
    }));

    app.get('/logout', authController.logout);

};