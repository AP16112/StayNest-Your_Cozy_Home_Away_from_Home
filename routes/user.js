// Here we will use this 'routes' folder for using Express Router actually.

// Here this 'user.js' file is actually the router file for the 'user' model
// And in this file, we will write all the routes related to users.

// SO here we will firstly require the express
const express = require("express");

// And then we will create our router object here
// so we will use this :- const router = express.Router();
const router = express.Router();  //Creates a new router instance.
// This router is like a mini Express app that can handle its own routes and middleware.
// It has access to all HTTP methods (get, post, put, delete, etc.), just like app does.
// So instead of writing everything in app.js with app.get() or app.post(), you define routes here with router.get() or router.post().

const User = require("../models/user.js"); 
// As we know that for this Model, by-default mongoose will create a collection called as 'users' for this model

// Here we are requiring this wrapAsync fn here
const wrapAsync = require("../utils/wrapAsync.js");

const passport = require("passport");

const { saveRedirectUrl } = require("../middleware.js");

// Here we are requiring this listingController here, so that we can use the functions which are present in this listingController here, so that we can keep our route file clean and easy to read and also easy to maintain.
const userController = require("../controllers/users.js");



// --------------------------------------------------------------------------------------------------------------------------------
// Router.route :-
// A way to group together routes with different verbs but same paths.
// router.route(path) actually Returns an instance of a single route which you can then use to handle HTTP verbs with optional middleware. Use router.route() to avoid duplicate route naming and thus typing errors.
// In simple terms, it allows you to define multiple HTTP method handlers for the same route path in a cleaner way. Instead of writing separate router.get(), router.post(), etc., you can chain them together using router.route().
// Example:
// router.route("/listings")
//     .get((req, res) => { /* handle GET /listings */ })
//     .post((req, res) => { /* handle POST /listings */ });
// SO here instead of writing two separate routes for GET and POST, we can group them together using router.route() which makes our code cleaner and more organized. It also helps to avoid typos in route paths since you only write the path once.

router.route("/signup")
    // Here this 'renderSignupForm' function is used to render the signup form, so here we will write the logic to render the signup form in this 'renderSignupForm' function here, so that we can call this 'renderSignupForm' function in our route file to render the signup form.
    .get( userController.renderSignupForm)   // here we are calling this renderSignupForm function which is present in this userController here, so that we can keep our route file clean and easy to read and also easy to maintain.
    .post( wrapAsync ( userController.signup) );  // here we are calling this signup function which is present in this userController here, so that we can keep our route file clean and easy to read and also easy to maintain.
    // Here this 'signup' function is used to register a new user, so here we will write the logic to register a new user in this 'signup' function here, so that we can call this 'signup' function in our route file to register a new user.

// Here as now we already written teh routes for GET and POST for this '/signup' route, so here we will not write the routes for GET and POST separately for this '/signup' route, instead we will group them together using router.route() which makes our code cleaner and more organized. It also helps to avoid typos in route paths since you only write the path once.



router.route("/login")
    .get( userController.renderLoginForm)   // here we are calling this renderLoginForm function which is present in this userController here, so that we can keep our route file clean and easy to read and also easy to maintain.
    // Here this 'renderLoginForm' function is used to render the login form, so here we will write the logic to render the login form in this 'renderLoginForm' function here, so that we can call this 'renderLoginForm' function in our route file to render the login form.
    .post( saveRedirectUrl, passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), userController.login);   // here we are calling this login function which is present in this userController here, so that we can keep our route file clean and easy to read and also easy to maintain.
    // Here this 'login' function is used to authenticate the user, so here we will write the logic to authenticate the user in this 'login' function here, so that we can call this 'login' function in our route file to authenticate the user.

// Now as now we already written the routes for GET and POST for this '/login' route, so here we will not write the routes for GET and POST separately for this '/login' route, instead we will group them together using router.route() which makes our code cleaner and more organized. It also helps to avoid typos in route paths since you only write the path once.



// Logout Route :-
// GET  --->  "/logout" route :- to logout the user from the session

//Note :-  It is a good idea to use POST or DELETE requests instead of GET requests for the logout endpoints, in order to prevent accidental or malicious logouts.

router.get("/logout", userController.logout);   // here we are calling this logout function which is present in this userController here, so that we can keep our route file clean and easy to read and also easy to maintain.
// Here this 'logout' function is used to logout the user from the session, so here we will write the logic to logout the user from the session in this 'logout' function here, so that we can call this 'logout' function in our route file to logout the user from the session.



//-----------------------------------------------------------------------------------------------------------------------------------------------------
// SignUp Route :-
// GET  ---->  "/signup"  route  :- to input the user details using signup form
// router.get("/signup", userController.renderSignupForm);   // here we are calling this renderSignupForm function which is present in this userController here, so that we can keep our route file clean and easy to read and also easy to maintain.
// Here this 'renderSignupForm' function is used to render the signup form, so here we will write the logic to render the signup form in this 'renderSignupForm' function here, so that we can call this 'renderSignupForm' function in our route file to render the signup form.


// Login after SignUp : 
// Passport's login method automatically establishes a login session.
// We can invoke login to automatically login a user.
// SO after successful registration, we can call req.login() to log the user in immediately without requiring them to go through the login form again. This is a convenient way to enhance user experience by keeping them logged in right after they sign up. So we can use this req.login() method in the POST /signup route after successfully registering the user to log them in automatically.

// POST  ---->  "/signup" :- to register that user into the database
// router.post("/signup", wrapAsync ( userController.signup) );   // here we are calling this signup function which is present in this userController here, so that we can keep our route file clean and easy to read and also easy to maintain.
// Here this 'signup' function is used to register a new user, so here we will write the logic to register a new user in this 'signup' function here, so that we can call this 'signup' function in our route file to register a new user.


//-----------------------------------------------------------------------------------------------------------------------------------------------------
// Login User :-

// GET  --->  "/login" route :- to input the user details using login form
// router.get("/login", userController.renderLoginForm);   // here we are calling this renderLoginForm function which is present in this userController here, so that we can keep our route file clean and easy to read and also easy to maintain.
// Here this 'renderLoginForm' function is used to render the login form, so here we will write the logic to render the login form in this 'renderLoginForm' function here, so that we can call this 'renderLoginForm' function in our route file to render the login form.


// POST --->  "/login"  route :-  to authenticate whether this user exists  in database or not.
// Here this passport.authenticate() is a middleware which will automatically check whether the user exists in the database or not and if it exists then it will automatically log in that user and if it does not exist then it will automatically give an error message and remain on the login page only. So we do not need to write any code for this actually as this is all handled by this passport.authenticate() middleware.
// Here this 'local' is the strategy which we are using for authentication and it is provided by passport-local-mongoose package and it is used for username-password authentication. So when we use this 'local' strategy, it will automatically check the username and password against the database and if they match, it will log in the user.
// Here this failureRedirect is used to redirect the user to the login page in case of failure and failureFlash is used to show the flash message in case of failure.

// Now we need to use this saveRedirectUrl before this passport.authenticate() middleware, because we need to store the original url in the session before redirecting the user to the login page in case of failure, so that after successful login, we can redirect the user back to that original url which he was trying to access before login. So we need to use this saveRedirectUrl middleware before this passport.authenticate() middleware, so that we can store the original url in the session before redirecting the user to the login page in case of failure.
// router.post("/login", saveRedirectUrl, passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), userController.login);   // here we are calling this login function which is present in this userController here, so that we can keep our route file clean and easy to read and also easy to maintain.
// Here this 'login' function is used to authenticate the user, so here we will write the logic to authenticate the user in this 'login' function here, so that we can call this 'login' function in our route file to authenticate the user.


//-----------------------------------------------------------------------------------------------------------------------------------------------------
// Logout Route :-
// GET  --->  "/logout" route :- to logout the user from the session

//Note :-  It is a good idea to use POST or DELETE requests instead of GET requests for the logout endpoints, in order to prevent accidental or malicious logouts.

// router.get("/logout", userController.logout);   // here we are calling this logout function which is present in this userController here, so that we can keep our route file clean and easy to read and also easy to maintain.
// Here this 'logout' function is used to logout the user from the session, so here we will write the logic to logout the user from the session in this 'logout' function here, so that we can call this 'logout' function in our route file to logout the user from the session.


//-----------------------------------------------------------------------------------------------------------------------------------------------------


// Now we will export this router object, so that we can use all these router.get() or router.post() etc inside the app.js directly by creating them here instead of creating them in app.js
module.exports = router;




//------------------------------------------------------------------------------------------------------------------------------------------------------
// Login after SignUp :-
// Passport's login method automatically establishes a login session.
// We can invoke login to automatically login a user.
// SO after successful registration, we can call req.login() to log the user in immediately without requiring them to go through the login form again. This is a convenient way to enhance user experience by keeping them logged in right after they sign up. So we can use this req.login() method in the POST /signup route after successfully registering the user to log them in automatically.
