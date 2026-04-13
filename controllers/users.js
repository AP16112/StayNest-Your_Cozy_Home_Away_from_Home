// here this is the controller file for users, so here we will write all the logic related to users in this file, so that our route file will be clean and we will just call the functions which are present in this controller file in our route file, so that our route file will be clean and easy to read and also easy to maintain. 

const User = require("../models/user.js"); 
// As we know that for this Model, by-default mongoose will create a collection called as 'users' for this model


module.exports.renderSignupForm = (req, res) => {
    // here we need to use this i.e 'users/signup.ejs' because here signup.ejs is present inside the users folder which present inside views folder and we only set the path till views folder only
    res.render("users/signup.ejs");
};

// Here this 'signup' function is used to register a new user, so here we will write the logic to register a new user in this 'signup' function here, so that we can call this 'signup' function in our route file to register a new user.
module.exports.signup = async (req, res) => {
    // Here we are using try-catch to handle the error & not he custom error because we just want the error to be given as flash message & we must remain on the login page in case of error occurs
    try {
        let { username, email, password } = req.body;

        const newUser = new User({email, username});

        // This register is a static method which will automatically store this user in the databse
        let registeredUser = await User.register(newUser, password);
        // register(user, password, callback) Convenience method to register a new user instance with a given password. Checks if username is unique.
        // SO it automatically check whether the username is unique or not.
        // User.register() is a static method that passport-local-mongoose adds to your model. It’s a convenience function that does two things at once:
        //- Creates a new user document with the fields you pass in (like email or username).
        //- Hashes and salts the password you provide, then stores it in the database securely.
        
        console.log(registeredUser);

        // Here this req.login() is a method provided by Passport to log in the user after successful registration. It will establish a login session for the user and store their information in the session. So we do not need to write any code for this actually as this is all handled by this req.login() method. 
        // It takes two arguments: the user object to log in and a callback function that will be called after the login process is complete. The callback function can be used to handle any errors that may occur during login and to redirect the user to the desired page after logging in.
        req.login(registeredUser, (err) => {
            if(err) {
                return next(err);
            }

            req.flash("success", "Welcome to StayNest!");
            res.redirect("/listings");
        });
        //When the login operation completes, user will be assigned to req.user.
    } catch(e) {
        req.flash("error", e.message);

        res.redirect("/signup");
    }
};

// Here this 'renderLoginForm' function is used to render the login form, so here we will write the logic to render the login form in this 'renderLoginForm' function here, so that we can call this 'renderLoginForm' function in our route file to render the login form.
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};


// Here this 'login' function is used to authenticate the user, so here we will write the logic to authenticate the user in this 'login' function here, so that we can call this 'login' function in our route file to authenticate the user.
module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to StayNest!");

    // here it will redirect the user to original url after successful login, so we can use this req.session.redirectUrl variable which we stored in the session before redirecting the user to the login page in the isLoggedIn middleware function to redirect the user back to that original url after successful login.
    // so we will actually stores this redirectUrl in the locals variable and then we will use that variable in the render method of the login route to redirect the user back to that original url after successful login.

    // here this 'redirectUrl' is actually the locals variable which we defined in the saveRedirectUrl middleware function and we stored the value of req.session.redirectUrl in that locals variable, so that we can easily access this redirectUrl variable in our ejs files without passing it in the render method of each route, so that we can easily access this redirectUrl variable in our ejs files using this redirectUrl variable and then we can use this redirectUrl variable to redirect the user back to that original url after successful login.
    // Now if there is no redirectUrl in the locals variable, then we will redirect the user to the '/listings' page after successful login, so we can use this '|| "/listings"' to set the default redirect url to '/listings' in case there is no redirectUrl in the locals variable.
    // Because in case of we are trying to login from home page, then isLoggedIn middleware will not get triggered so it will not store the original url in the session and then it will not store the redirectUrl in the locals variable, so in that case we want to redirect the user to the '/listings' page after successful login, so we can use this '|| "/listings"' to set the default redirect url to '/listings' in case there is no redirectUrl in the locals variable.
    // SO if redirectUrl exists, then it will get stored here & then "/listings" will not get executed because of the short-circuiting nature of the '||' operator and if redirectUrl does not exist, then it will get stored as "/listings" here because of the short-circuiting nature of the '||' operator.
    let redirectUrl = res.locals.redirectUrl  ||  "/listings";

    // Now here this 'redirectUrl' is actually the locals variable which we defined in the saveRedirectUrl middleware function and we stored the value of req.session.redirectUrl in that locals variable, so that we can easily access this redirectUrl variable in our ejs files without passing it in the render method of each route, so that we can easily access this redirectUrl variable in our ejs files using this redirectUrl variable and then we can use this redirectUrl variable to redirect the user back to that original url after successful login.
    res.redirect(redirectUrl);  
};


// Here this 'logout' function is used to log out the user, so here we will write the logic to log out the user from the session in this 'logout' function here, so that we can call this 'logout' function in our route file to log out the user from the session.
module.exports.logout = (req, res, next) => {
    // Here this req.logOut() is a method provided by Passport to log out the user from the session. It will remove the user’s information from the session and effectively log them out. So we do not need to write any code for this actually as this is all handled by this req.logOut() method.
    // It actually make use of the deserializeUser method which we defined in the passport configuration file to remove the user from the session and log out the user.
    // And it takes a callback function as an argument which will be called after the user is logged out. So we can use this callback function to handle any error that may occur during the logout process and also to redirect the user to the desired page after logging out.
    req.logOut((err) => {
        if(err) {
            return next(err);
        }

        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    });
};