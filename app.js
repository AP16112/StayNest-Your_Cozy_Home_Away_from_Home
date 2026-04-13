// Here in this app.js, we will write our basic code setup.

//-------------------------------------------------------------------------------------------
// Project Name :- "StayNest" – Your Cozy Home Away from Home
// StayNest is designed to be more than just a place to stay.
// It’s a warm, welcoming haven that emphasizes comfort, simplicity, and the feeling of home wherever you travel.
// The name reflects the idea of a “nest,” a safe and cozy retreat, paired with the convenience of modern travel.
// Whether you’re exploring new cities or escaping for a weekend getaway, StayNest offers travelers a reliable, home-like experience that blends ease, charm, and authenticity.
//-------------------------------------------------------------------------------------------

// Here we firstly need to initialize :- npm init -y 
// It is to create a package.json file in our project folder. 
// Then we need to install the required dependencies :- 
// npm install express 
// npm install ejs
// npm install mongoose


// Once environmental variables gets saved in .env file, then we can use them anywhere in our project.
// But we can't use these environment variables directly in our code, we need to load them into our application using the dotenv package. To do that, we need to require the dotenv package and call the config() method at the very beginning of our application (usually in the app.js file) before any other code that uses environment variables. This will load the environment variables from the .env file into process.env, allowing us to access them throughout our application using process.env.KEY_NAME.

// here we are using this condition to check that if our application is not running in production environment, then we will load the environment variables from the .env file using dotenv package. This is a common practice to ensure that we only load the .env file during development and testing, and not in production where environment variables are typically set through other means (like hosting platform settings or CI/CD pipelines). By doing this, we can keep our production environment secure and avoid accidentally exposing sensitive information from the .env file.
if(process.env.NODE_ENV !== "production"){  
    require('dotenv').config() // or import 'dotenv/config' if you're using ES6
}
// console.log(process.env) // remove this after you've confirmed it is working
// console.log(process.env.SECRET);
// So all the environment variables that we have defined in our .env file will be available in our application through process.env object, and we can access them using process.env.KEY_NAME where KEY_NAME is the name of the environment variable that we want to access. For example, if we have an environment variable called SECRET in our .env file, we can access its value in our application using process.env.SECRET. This allows us to keep sensitive information like API keys, database credentials, and other configuration details out of our source code and easily manage them through environment variables.



// Now here we will use RESTful APIs along with Databases actually.
//This express is actually a function here
const express = require("express");
//And we store the value return by this express() fn in a variable called app
//We generally by convention take the name of variable as app, but we can take any name also
const app = express();
//Now this 'app' will help us to create the server side web application
//This 'app' is actually the object

const mongoose = require("mongoose");
// mongoose is a library that creates a connection between MongoDB & Node.js JavaScript Runtime Environment.


// here we are requiring the cookie-parser package of npm to parse the cookies
const cookieParser = require("cookie-parser");
// And then we need to use it also:-
// app.use(cookieParser());
// Here this 'cookieParser' is actually the middleware
// But for using signed cookies, we need to pass some secret signature or code also inside this cookiePraser() actually
app.use(cookieParser("secretcode"));

const port = 8080;
const path = require("path"); //here we are requiring the path package

//It will set the view engine to EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));   //here we are setting the path for views folder so that express can easily find this views from any folder
//Here __dirname → The absolute path of the current file’s directory i.e the directory of index.js file.
//- "views" → The folder where your template files are stored.
//- path.join(__dirname, "views") → Safely constructs the full path to the views folder, regardless of operating system.


// So here this is method-override middleware.
// So use it, we firstly need to install it using :- npm install method-override
// Those two lines work together to let your Express app handle HTTP methods beyond GET and POST when using HTML forms.
// The browser sends a POST request, but method-override sees _method=PUT and changes the request method internally to PUT.
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
// here this 'app.use(methodOverride("_method"))' means: look for a query parameter or form field called _method. If _method exists, override the request’s HTTP method with its value.
// Example: a form submits POST /listings/123?_method=PUT. The middleware sees _method=PUT and changes the request method internally to PUT.
//So it can change the POST or GET request to either PATCH or PUT or DELETE request.
// So we can’t directly send PATCH request from a html form, but we can indirectly simulate it using method-override. This is the standard way to make RESTful routes work with plain HTML forms.


// Here we will firstly require this custom error class using 'ExpressError' js file here to use it.
const ExpressError = require("./utils/ExpressError.js"); 

const session = require("express-session");
// this express-session is actually a middleware
// so we will make use of app.use() here

const MongoStore = require('connect-mongo');

const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
// Here this local strategy we are going to follow actually.

const User = require("./models/user.js"); 
// As we know that for this Model, by-default mongoose will create a collection called as 'users' for this model


//SO this is a standard line which we use always whenever we use the POST request
//Here app.use() means that this work must happens for all requests
//Here this 'express.urlencoded({extended : true})' is actually a middleware
app.use(express.urlencoded({ extended: true }));   // for parsing the form data
//SO it means if for any post request, url encoded data comes, then express will parse it to understand it
app.use(express.json()); // for JSON data
//SO it means if for any post request, json data comes, then express will parse it to understand it


//Serving Static files :-
// So it means that if we want to include CSS, JS like files also along with HTML to return them as response, then we use this serving static files.
// Serving static files refers to the process where a web server delivers fixed, pre-existing files (like HTML, CSS, JavaScript, images, fonts, or videos) directly to the client’s browser without any server-side processing or dynamic generation. 
// These files don’t change unless the developer manually updates them.
//syntax :-
// app.use( express.static(folder_name)) 
//where this 'express.static(folder_name)' is middleware actually. And foldername is the folder which contains all the static files
//So bydefault, express search for 'public' folder to find all the static files
//SO we generally take the folder name as 'public' for the folder which contains all the static files.
//SO although if we want to change the names of these default names folder, we need to use another additional function for that.
// app.use(express.static("public"));   //So here it also means that all the files present inside this 'public' folder will be available to ejs
//So here public folder will serve all the files, & then ejs can directly access all the files directly 
//THis is better way to write because now even if we run the server from parent folder, then also it can eaily find this public folder
app.use(express.static(path.join(__dirname, "/public")));    
// This we use when we have files directly inside public folder
// Here this path.join(__dirname, "/public") :- Ensures Express always finds the public folder relative to the current file’s directory.
// This avoids issues if your app is run from different locations



// Now we will make use of EJS Mate for more better templating.
// But to use it, we firstly need to install it using :- npm install ejs-mate
const ejsMate = require("ejs-mate");
// Ejs-mate helps us to create many templates or layouts
// EJS-mate is an Express.js layout engine for EJS
// It helps us create reusable templates and layouts
// Supports partials, blocks, and inheritance for cleaner code
// Makes it easy to maintain consistent headers, footers, and navigation
// Ideal for building multi-page applications with shared structures
// Without EJS-mate: You’d repeat <head>, <nav>, and <footer> code in every .ejs file.
// With EJS-mate: You define a base layout (e.g., layout.ejs) and extend it in child templates, keeping your project DRY (Don’t Repeat Yourself).
// In any website, generally navbar or footer remains the same for all pages, so instead of creating templates for navbar & footer for all pages, we make use of this ejs-mate to create them once & then use them many times just like we use 'includes'

//It tells that “Whenever we render .ejs files, use ejsMate as the rendering engine instead of the default EJS renderer.”
app.engine('ejs', ejsMate);   // Set ejs-mate as the rendering engine for .ejs files
// Without ejsMate, EJS only does simple templating.
// With ejsMate, you can define a base layout (like layout.ejs) and extend it in multiple views, keeping your code DRY and consistent.
// Now we will create a folder names 'layouts' for creatings base layouts that we can extends & use in other ejs files.



// Now we will reuire 'router' object from the 'listing.js' file from the routes folder here, so that we can use that router object here directly 
const listingRouter = require("./routes/listing.js");
// Now here this 'listingRouter' actually representing the router object having all the routes like router.get() or router.post() or etc.

// Now we will reuire 'router' object from the 'review.js' file from the routes folder here, so that we can use that router object here directly 
const reviewRouter = require("./routes/review.js");
// Now here this 'reviewRouter' actually representing the router object having all the routes like router.get() or router.post() or etc.

// Now we will reuire 'router' object from the 'user.js' file from the routes folder here, so that we can use that router object here directly 
const userRouter = require("./routes/user.js");



// Here this MONGO_URL is the URL of our MongoDB database, which is running locally on our machine.


// Here this process.env.ATLASDB_URL is the URL of our MongoDB database, which is running on cloud i.e on MongoDB Atlas.
const dbUrl = process.env.ATLASDB_URL;
// Here this dbUrl is the URL of our MongoDB database, which is running on cloud i.e on MongoDB Atlas. We are storing this URL in an environment variable called ATLAS_URL in our .env file for security reasons, so that we can easily manage it and keep it secure. We can access this environment variable in our application using process.env.ATLAS_URL.
// So here we will use this dbUrl to connect to our MongoDB database using mongoose.connect() method.



// Here this .connect() fn of mongoose is used to connect to mongoDB server
// It will Connects to a local MongoDB server
// Uses database name: staynest
// 127.0.0.1 is the loopback IP (same as localhost)
// Uses default MongoDB port 27017 (which is a fixed port number)
// mongoose.connect(MONGO_URL);
// Here 'staynest' is the database of mongoDB to which we are connecting

// Here As soon as we run this 'mongoose.connect('mongodb://127.0.0.1:27017/staynest');' command, it will actually awaits for a promise from the database itself.
// Here this .connect() method is a asynchronous method, so it will start a asynchronous process
// So most of the proccess that we will perform using mongoose will actually be asynchronous processes because sometimes it takes time to gets the response from the database, so it is necessary for these processes to be asynchronous
// SO we will handle all these functions asynchronously only.
// SO that's why we will use this way :-
// As we know that An async function always returns a Promise, here also it will return a promise
// What is happening here? :-
// mongoose.connect() is asynchronous. So, it returns a Promise
// await:
// pauses execution inside main()
// waits until MongoDB connection is done
// If connection succeeds → move on & print 'connected to DB successfully'
// If connection fails → throw an error

main().then(() => {
    console.log("connected to DB successfully");
})
.catch((error) => {
    console.log(error);
});

async function main() {
    await mongoose.connect(dbUrl);
    // use `await mongoose.connect(MONGO_URL);` if your database has auth enabled
}



const store = MongoStore.create({
    mongoUrl: dbUrl,   // so now all our session info gets stored in MongoDb Altas store.
    // Here we are passing the secret in this MongoStore.create() method also because we are using this store to store our session data in the database, so we need to pass the secret here also to make the session cookie as signed cookie.
    // here we are using crypto to generate the secret for signing the session cookie, so that it is more secure than using a simple string as secret.
    crypto: {
        secret: process.env.SECRET,
    },
    //Here by this touchAfter option, we are setting the time period after which the session data will get updated in the database, so that it will not update the session data in the database for every request, it will only update the session data in the database after this time period, so that it will reduce the number of writes to the database and improve the performance of our application.
    // Normally, every time a user makes a request, the session store updates the session document in MongoDB.
    // This can cause a lot of writes to your database, even if the session data hasn’t changed.
    // touchAfter sets a minimum time interval (in seconds) before the session is “touched” (updated) again.
    // If the session hasn’t changed, but the user keeps making requests, MongoDB won’t be updated until that interval passes.
    touchAfter: 24 * 60 * 60 // time period in seconds
    // Here, the session will only be updated in MongoDB once per day if the session data hasn’t changed.
    // If you modify the session (e.g., add/remove data), it will still be saved immediately.
    // This reduces unnecessary writes and improves performance.
});
// So here we are creating a new MongoDB store for our sessions using connect-mongo. This will allow us to store session data in our MongoDB database instead of in memory, which is more scalable and suitable for production environments. We pass the mongoUrl option with our database URL to connect to the correct MongoDB instance.

// so now all our session info gets stored in MongoDb Altas store.

store.on("error", () => {
    console.log("ERROR in MONGO SESSION STORE", error);
});

const sessionOptions = {
    // store: store,   // here we are passing the store that we created above to store our session data in the database, so that it will be more secure and scalable than storing the session data in memory.
    store,     // here we are passing the store that we created above to store our session data in the database, so that it will be more secure and scalable than storing the session data in memory.
    secret: process.env.SECRET,
    resave: false,  
    saveUninitialized: true,
    //cookie → This object defines settings for the session cookie that gets sent to the browser.
    // expires → Sets the exact date/time when the cookie should expire.
    // Date.now() → Returns the current timestamp in milliseconds. 7 * 24 * 60 * 60 * 1000 → Number of milliseconds in 7 days:
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
}
// This is the secret used to sign the session ID cookie.
// The secret itself should be not easily parsed by a human and would best be a random set of characters. A best practice may include:
// The use of environment variables to store the secret, ensuring the secret itself does not exist in your repository.
// Periodic updates of the secret, while ensuring the previous secret is in the array.

// But for easiness we are taking a simple string as secret here.
// so the cookie which we are sending to browser which containing sessionId is actually a signed cookie.
// so we need to make use of sceret to make this as signed cookie i.e to add signature to this cookie. 

// So now as we use our session as middleware & also added a secret in it, so now with any request i.e app.get() or post() or etc,  a sessionId will get stored inside our browser in the form of a cookie.

// resave :- Forces the session to be saved back to the session store, even if the session was never modified during the request.


// app.get('/', (req, res) => {
//     res.send("Hi, I am root");
// });


// Now to use these session options, we make use of this:-
app.use(session(sessionOptions));
app.use(flash());
// We always need to use this flash before the app.use("/listings") or etc routes because we will going to use this flash with the help of those routes only i.e we will use this flash inside those routes only.


// We need the session to make use of passport because within one session, user credentials remains the same
// So we need to use this passport below this app.use(session(sessionOptions)) only.

app.use(passport.initialize());
// This sets up Passport so it can intercept requests and look for authentication data. Without it, Passport’s strategies (like local login) won’t run.
app.use(passport.session());
// So we use this so that each request must know of what session they are actually a part of.
// This hooks Passport into Express’s session middleware. It ensures that once a user is authenticated, their session ID is stored in a cookie. On subsequent requests, Passport can deserialize the user from the session and attach the user object to req.user.


// so each new user will get authenticated using local-strategy
// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());   // used to serialize or store the user info into the session
passport.deserializeUser(User.deserializeUser());  // used to deserialize or remoce the user info from the session

// passport.serializeUser(User.serializeUser());
// Purpose: Defines how user data is stored in the session. When a user logs in successfully, Passport needs to "serialize" the user — i.e., decide what piece of information should be saved in the session cookie.
// By default, passport-local-mongoose provides a helper method User.serializeUser() that tells Passport to store the user’s unique identifier (usually _id) in the session.
// This keeps the session lightweight — instead of storing the whole user object, only the ID is stored.
// e.g User logs in with username + password. Passport verifies credentials.
// serializeUser runs → stores user._id in the session cookie. The browser now carries this session ID with each request.

// passport.deserializeUser(User.deserializeUser());
// Purpose: Defines how to retrieve full user details from the session. When a request comes in, Passport looks at the session cookie, finds the stored user ID, and then "deserializes" it — i.e., fetches the full user object from the database.
// User.deserializeUser() is a helper from passport-local-mongoose that knows how to look up the user by ID and attach it to req.user.
// e.g Browser sends a request with the session cookie. Passport extracts the stored user._id.
// deserializeUser runs → queries MongoDB for that user. The complete user object is attached to req.user, so you can access it in your routes.


// SO this middleware also we need to create before the app.use("/listings") or etc routes because we will going to use this with the help of those routes only
// Here this is the middleware which we are using to define our local variables for flash messages, so that we can easily access these flash messages in our ejs files without passing them in the render method of each route.
// Now all the variables which we defined as locals here, will be available in all the ejs files without passing them in the render method of each route, so we can easily access these in ejs files using these variable names only without passing them in the render method of each route.
app.use((req, res, next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    // console.log(res.locals.successMsg);

    res.locals.currentUser = req.user;   // here this 'currentUser' is the variable which we are defining to store the value of req.user in it, so that we can easily access this currentUser variable in our ejs files without passing it in the render method of each route, so that we can easily access the details of currently logged in user in our ejs files using this currentUser variable.
    // here this 'currentUser' is the variable which we are defining to store the value of req.user in it, so that we can easily access this currentUser variable in our ejs files without passing it in the render method of each route, so that we can easily access the details of currently logged in user in our ejs files using this currentUser variable.
    // So now we can easily access the details of currently logged in user in our ejs files using this currentUser variable like this :- <%= currentUser.username %> or <%= currentUser.email %> etc.

    next();
});


// app.get("/demouser", async (req, res) => {
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student"
//     });

//     // This register is a static method which will automatically store this fake user in the databse
//     let registeredUser = await User.register(fakeUser, "helloworld");
//     // register(user, password, callback) Convenience method to register a new user instance with a given password. Checks if username is unique.
//     // SO it automatically check whether the username is unique or not.
//     // User.register() is a static method that passport-local-mongoose adds to your model. It’s a convenience function that does two things at once:
//     //- Creates a new user document with the fields you pass in (like email or username).
//     //- Hashes and salts the password you provide, then stores it in the database securely.
//     // fakeUser is an object with the user’s details (e.g. { email: "test@example.com" }).
//     // "helloworld" is the plain-text password. The plugin will hash it and store the hash + salt, not the raw password.

//     res.send(registeredUser);
// });


// Here we are just checking or testing this Listing model here
// As we know that for this Model, by-default mongoose will create a collection called as 'listings' for this model
// app.get('/testListing', async (req, res) => {
//     // creating a new listing document using the Listing model for this 'listings' collections
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India",
//     });

//     // Now to store this sampleListing in 'listings' collection of database, we need to save it.
//     await sampleListing.save();   // as we know that .save() is asynchronous function, so here we will use this way to handle the promise return by this, using async-await way.
//     console.log("sample was saved");
//     res.send("successful testing");
// });


//Now here this 'listingRouter' actually representing the router object having all the routes like router.get() or router.post() or etc.
// app.use("/", listingRouter);
// listingRouter → This is the router object you created earlier with const router = express.Router(). It contains all the routes defined with router.get(), router.post(), etc.
// app.use("/", listingRouter) → Tells Express: “For any request starting with /, hand it over to the listings router.”
// So instead of defining routes directly on app (like app.get()), you define them on router in a separate file, then plug that router into your main app.
// But we generally take some common starting path here in app.use() like '/listings' which comes in all the listings routes.
// So now all the paths in router listing.js file, will starts after the '/listing'
app.use("/listings", listingRouter);
// Organized routes: All routes inside the listings router will automatically be prefixed with /listings.
// Avoids repetition: You don’t have to write /listings in every route definition inside the router file.
// Clear structure: Makes it obvious that these routes belong to the “listingRouter” resource.

// here this '/listing' is parent route & all the route that will be present after this in listing.js  router.get() or router.post() will be child route.


// app.use("/listings/:id/reviews", reviewRouter) → Tells Express: “For any request starting with /listings/:id/reviews, hand it over to the reviews router.”
// So instead of defining routes directly on app (like app.get()), you define them on router in a separate file, then plug that router into your main app.
// But we generally take some common starting path here in app.use() like '/listings/:id/reviews' which comes in all the reviews routes.
// So now all the paths in router review.js file, will starts after the '/listings/:id/reviews'
app.use("/listings/:id/reviews", reviewRouter);
// Organized routes: All routes inside the listings router will automatically be prefixed with /listings/:id/reviews.
// Avoids repetition: You don’t have to write /listings/:id/reviews in every route definition inside the router file.
// Clear structure: Makes it obvious that these routes belong to the “review” resource.
// Now all routes in the listings router will start after /listings/:id/reviews.

// here this '/listings/:id/reviews' is parent route & all the route that will be present after this in review.js  router.get() or router.post() will be child route.


// Now The :id parameter belongs to the parent route (/listings/:id/reviews).
// By default, child routers do not have access to parent route parameters.
// If you try to use req.params.id inside the reviews router, it will be undefined.
// So we need to make use of 'mergeParams' here
// We need mergeParams: true in Express when working with nested routers because by default, a child router does not inherit the route parameters defined in its parent.
// so we will use this :- const router = express.Router({ mergeParams: true });


app.use("/", userRouter);
// Now here this 'userRouter' actually representing the router object having all the routes like router.get() or router.post() or etc.
// So now all the paths in router user.js file, will starts after the '/'   
// here this '/' is parent route & all the route that will be present after this in user.js  router.get() or router.post() will be child route.


//-------------------------------------------------------------------------------------------------------------------------------
// Sending cookies using Express server:-

// Cookies :- 
// Web Cookies :-
// HTTP cookies are small blocks of data created by a web serer while a user is browsing a website and placed on the user's computer or other device by the user's web browser.
// Web cookies are small pieces of data stored in your browser by websites to remember information about you, such as login status, preferences, or activity, enabling a more personalized and consistent browsing experience. They are essential for session management but also raise privacy concerns since they can be used for tracking.
// e.g When you select dark mode on one page, the site needs a way to remember your choice so that the same preference applies across all other pages. Since HTTP itself is stateless, the browser doesn’t “remember” anything between requests. That’s where cookies come in.

// cookies are stored as name–value pairs. That’s the fundamental structure that makes them easy to set, read, and manage.
// As cookies are sent by server, so here as we know Express is our server
// So here cookies will be send by express actually
// res.cookie("greet", "hello");  // That line is using Express’s res.cookie() method to set a cookie in the user’s browser.
// .cookie(name, value) → A method that sets a cookie with the given name and value pairs.
// "greet" → The cookie’s name (key).
// "hello" → The cookie’s value.
// So once a cookie is send & stored in browser, then it will be available to all the routes of the same website.
// Here server is sending multiple cookies but until no request comes to this '/getcookies' route, these cookies won't be stored in browser
// But if once they get stored, they will be available to all the routes for that website
// e.g app.get("/getcookies", (req, res) => {
    // res.cookie("greet", "hello");
    // res.cookie("madeIn", "India");
    // res.send("send you some cookies!");
// });

// In Express, all cookies sent by the client are available in req.cookies (assuming you’re using the cookie-parser middleware).

// app.get("/getcookies", (req, res) => {
//     res.cookie("greet", "hello");
//     res.cookie("madeIn", "India");
//     res.send("send you some cookies!");
// });

// app.get("/greet", (req, res) => {
//     // So if name doesn't exists in cookies, the this 'anonymous' will get stored in this name
//     let { name = "anonymous" } = req.cookies;
//     res.send(`Hi, ${name}`);
// });

// Then we can parse those cookiers using npm cookie-parser package
// So we need to require 'cookie-parser' package after installing it  :- npm install cookie-parser

// app.get("/cookie", (req, res) => {
//     console.dir(req.cookies);
//     res.send("Hi, I am root"); 
// });


// Signed Cookies :-
// here we will do two things:- send signed cookies & verify signed cookies
// Signed cookies are cookies that include a cryptographic signature to ensure their integrity. They’re used to prevent tampering by the client.

// What Makes a Cookie “Signed” :-
// Normally, a cookie is just a name–value pair (e.g., theme=dark).
// With signed cookies, Express (using cookie-parser with a secret key) adds a hash signature to the cookie value.
// When the cookie comes back from the browser, Express verifies the signature.
// If the cookie was modified by the client, the signature won’t match, and Express rejects it.

// To use signed cookies, we firstly need to pass some secret code like "secretcode" like
// app.use(cookiePraser("secretcode"))   // so we can pass any string here as secret code
// And now during sending cookie, we also need to make signed : true
// e.g res.cookie("color", "blue", { signed: true });    // Signed: true → Express attaches a signature using "secretcode".
// So now data will not send in raw form but send in some kind of unreadable form.
// But it is not completely unreadable as if we want we want read it also, because signed cookies is not used for making value of cookie unreadble but it is actually used to detect whether client makes any changes to that cookie or not

// app.get("/getsignedcookie", (req, res) => {
//     res.cookie("made-in", "India", { signed: true });
//     res.send("signed cookie sent");
// }); 

// It is used to verify the signed cookies
// app.get("/verify", (req, res) => {
//     // It will print the signed cookies as req.cookies is not used to access the unsigned cookies & not the signed cookies
//     // console.log(req.cookies);
//     console.log(req.signedCookies);   // it will show all the signed cookies only
//     res.send("verified");
// }); 

// A signed cookie stores the value + a cryptographic signature generated using your secret string. When the browser sends the cookie back, Express verifies the signature.
// If the value has been changed, the signature won’t match.

// SO, Behavior When You Change the Value
//- Change only the value (e.g., blue → red) The signature no longer matches. Express detects tampering.
// In req.signedCookies, that cookie will be missing (treated as invalid).
// In req.cookies, you’ll still see the raw tampered value (red), but it won’t be trusted.
//- Change the whole cookie string (delete or rewrite it completely)
// The browser sends back something that doesn’t match the signed format.
// Express can’t verify it. In req.signedCookies, it will show up as empty (no valid signed cookies).



//-------------------------------------------------------------------------------------------------------------------------------
// So if we try to access some route or path, for which we don't have any route defined, then it means that page not exists for our website
// SO we want to give page not found error. so we will use this :-

// app.all("*", ...) → Matches all HTTP methods (GET, POST, PUT, etc.) and all paths (* means any route).
// It’s placed at the end of your route definitions. If none of the earlier routes match, this one will run. Inside, it calls next(new ExpressError(404, "Page Not Found!")).
// ExpressError is a custom error class you defined (likely extending Error with a statusCode).
// This creates a new error object with status 404 and message "Page Not Found!".
// next(err) forwards the error to your centralized error‑handling middleware.
// app.all("*", (req, res, next) => {
//     next(new ExpressError(404, "Page Not Found!"));
// });// So this won't work here as we are using Express v5 here


// But Only in Express v4 :- "*" was treated as a catch‑all route, matching any path.
// In Express 5 beta, the routing engine upgraded its dependency (path-to-regexp).
// "*" is no longer valid — it throws the error you saw (Missing parameter name at index 1: *).
// Instead, you must use:
// app.all(/.*/, (req, res, next) => {
//     next(new ExpressError(404, "Page Not Found!"));
// });
// ---------------------- or -----------------
// app.use((req, res, next) => {
//     next(new ExpressError(404, "Page Not Found!"));
// });

app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});


// Custom Error Handling :-
// Here we will use this middleware to hanlde these errors

app.use((err, req, res, next) => {
    let {statusCode=500, message="Something went wrong!"} = err;

    // Here  .send() sends the response body and ends the response.
    // res.status(statusCode).send(message);     // it will send a response with status code as this 'statusCode' & the message as this message

    // res.render("error.ejs", { err });
    res.status(statusCode).render("error.ejs", { err });
});



//this .listen() fn have two parameters & the 1st parameter is 'port' & end parameter is some callback fn
//.listen actually creates a web server which listens for incoming API requests
app.listen(port, () => {
    console.log(`app(i.e server) is listening to port ${port}`);
});  //So it will starts the server which continuously listens for API requests




//--------------------------------------------------------------------------------------------------------------------------------
// Form Validations :-
// When we enter data in the form, the browser and/or the web server will check to see that the data is in the correct format and within the constraints set by the application.

// Validations are of two types :-
// 1. Client-Side Validation :-   for this, we will make use fo form validations
// Where it happens: In the browser, before the request is even sent to the server.
// Purpose: Provides immediate feedback to the user, prevents obvious mistakes, and reduces unnecessary server calls.
// Examples: HTML5 attributes like required, minlength, maxlength, pattern.
// JavaScript checks (e.g., ensuring a password is at least 8 characters).
// Frontend frameworks (React, Angular, Vue) often include form validation logic.
// Limitation: It can be bypassed easily (e.g., disabling JavaScript, sending requests via Postman). That’s why it’s not enough on its own.
// 2. Server-Side Validation :-
// Where it happens: On the backend (Express + Mongoose in your case).
// Purpose: Ensures that even if client-side validation is bypassed, the database only accepts valid data.
// Examples:Mongoose schema rules (required: true, minlength, match for regex).
// Custom validation logic in Express routes.
// Checking for duplicates or business rules (e.g., booking dates not overlapping).
// Strength: Cannot be bypassed by the client — it’s the ultimate safeguard.

// Here client-side validaton can be done using form validations.
// But if someone is directly sending POST or PATCH or PUT request using 'POSTMAN' or 'Hoppscoth', then server can receive the invalid data, so we also need to handle the server-side validations also.

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Here we will create another folder called as 'utils' which is used to store utility things i.e extra things like custom error class, wrapAsync fn, etc.


// Tool used for Schema Validation :-
// Joi is a powerful JavaScript library used for schema-based validation of data, especially in Node.js applications. It lets you define rules for objects, strings, numbers, arrays, etc., and ensures incoming data matches those rules before being processed.
// Toi was Originally part of the hapi.js framework, now a standalone package.
// Purpose: Provides a declarative way to validate data structures.
// Use Case: Commonly used in Express apps to validate request bodies (e.g., form submissions, API payloads).

// But to use this, we firstly need to install it as it is a npm package only using :- npm install joi
// And then we need to require it firstly to use it.
// ANd then we will define the schema using this Joi object then.

// And this schema is not the mongoose schema but it is actually the server-side validation schema.
// Mongoose schema → Defines how data is stored in MongoDB (structure + DB-level validation).
// Joi schema → Defines how incoming request data is validated at the server-side before hitting the DB.

// So Joi acts as a gatekeeper: it ensures that only clean, valid data reaches your Mongoose models. This way, you catch bad input early and return meaningful error messages to the client.
// Joi is not a replacement for Mongoose schemas — it’s a server-side validation layer that complements them.

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Mongo $pull operator :-
// The $pull operator removes from an existing array all instances of a value or values that match a specific condition.
// $pull removes all instances of a value (or values matching a condition) from an array field in a document.
// It’s like saying: “Go into this array and delete anything that matches my filter.”

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Express Router :- 
// Express Router are a way to organize your Express application such that our primary app.js file does not become bloated.
// const router = express.Router()  ---> creates new router object

// In Express, a router is a way to organize your routes into separate modules instead of keeping everything inside app.js. 
// It helps keep your code clean and modular.
// It is a mini Express application that handles routes and middleware.
// You can define routes in a router file, then mount that router in your main app.
// Useful when you have multiple resources (e.g., listings, reviews, users).

// A router object is an instance of middleware and routes. You can think of it as a “mini-application,” capable only of performing middleware and routing functions. Every Express application has a built-in app router.
// A router behaves like middleware itself, so you can use it as an argument to app.use() or as the argument to another router’s use() method.
// The top-level express object has a Router() method that creates a new router object.
// Once you’ve created a router object, you can add middleware and HTTP method routes (such as get, put, post, and so on) to it just like an application.

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// So whenever a client interact with server, then that 1 single interaction is called as one session.
// In web development, a session is not just one request–response cycle.
// Instead, it’s a series of interactions between a client and server that are tied together by a unique identifier (usually a session ID).
// Example: When you log in, the server creates a session for you. As long as your session is active, you can move across pages without re‑logging in.

// Protocols are the rules that req, or res follows.
// Protocols are the rules and standards that govern how requests and responses are exchanged.
// Example: HTTP defines how a browser asks for a page and how the server responds.

// What is State? :-
// State basically means that all the information related to request.
// State refers to the information the server remembers about a client’s interactions.
// Since HTTP is stateless by default, each request is independent.
// To maintain state (like login status, cart items, or preferences), we use mechanisms like cookies, sessions, or tokens.
// State → The remembered information about those interactions (e.g., “User Arpit is logged in, cart has 3 items”).


// Stateful Protocol :-
// Stateful protocol require server to save the status and session information.
// e.g ftp i.e file transfer protocol

// Stateless Protocol :-
// Stateless Protocol does not require the server to retain the server information or status.
// e.g http
// so the server setup using express uses http protocol only.

// A session is the ongoing relationship between client and server.
// State is the data that makes that relationship meaningful.
// Protocols are the rules both sides follow to communicate.


// Express Sessions :-
// An attempt to make our session stateful i.e it is used to make our current express sessions slightly stateful.
// It means that we store the informations related to session on server side.

// express session firstly create the session id whenever new user comes & then store all the related information about that session
// this is server side actually
// e.g user1 :-  new session will be created for 
// this having some sessionID                                this is client side
//   sessionId:101 :- {        -------------------------->   so here express session will not send this whole info, instead it will just send the sessionId, and later on if we want whole info, we can access that using this id
//          item: laptop                                     so, here in browser only this 101 gets stored in the form cookie as the temporary storage                         
//          item: charger                                    so, here express session will send a cookie storing this sessionID which will gets stored inside browser.
//   }

//   user2 :-  new session will be created for
//   this having some sessionID
//   sessionId:102 :- {
//          item: shirt
//          item: pants
//   }
// Here this is cart storage info which is temporary storage, & we only store permanent storage in database, so we will not store this in database and will actually store this in some temporary storage.
// And as bydefault http doesn't store related informations, so once we change any web page, that info gets lost, so we need to store that related temporary information somewhore.

// cookies are used to store some tiny bit of informations inside the browser.

// SO express session actually stores the data in temporary storage & also send the sessionID in the form of cookie to the frontend i.e browser

//1. New user arrives :- Express (with express-session) generates a unique session ID.
// This ID is sent to the client inside a cookie (commonly named connect.sid).
//2. Server stores session data :- On the server side, Express creates a session object linked to that ID.
// You can attach any information to it, e.g.: req.session.username = "Arpit";  or  req.session.cart = ["Book", "Laptop"];
//3. Client makes another request :- The browser automatically sends back the session ID cookie.
// Express looks up the session object using that ID. Now you can retrieve the stored data: console.log(req.session.username); // "Arpit"
//4. Session persists until expired or destroyed :- Sessions usually expire after a set time (e.g., 30 minutes of inactivity).
// You can also manually destroy them (e.g., on logout).


// express-session is actually a npm package. so we firstly need to install it.


//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// connect-flash :-
// It is another npm package which is used to flash the messages.
// It is also an middleware in express actually.
// THese messages only appears once & if we refresh the page, these messages won't appears then.
// The flash is a special area of the session used for storing messages.
// Messages are written to the flash and cleared after being displayed to the user.

// Flash messages are stored in the session. First, setup sessions as usual by enabling cookieParser and session middleware.
// Then, only use flash middleware provided by connect-flash.

// SO we must have session created in order to use connect flash.


// res.locals :-
// res.locals is an object that contains local variables scoped to the response.
// Anything you put in res.locals is available in your view templates (EJS, Pug, etc.) for that request.
// Unlike req.flash(), which stores temporary messages in the session, res.locals is just a container for passing values to the rendered view.


//-------------------------------------------------------------------------------------------------------------------------------------------------------
// Authentication :-
// Authentication is the process of verifying who someone is.
// SignUp/Login part comes under this only.

// Authorization :-
// Authorization is the process of verifying what specific applications, files, and data a user has access to.


// Storing Passwords :-
// We NEVER store the passwords as it is. We store their hashed form.
// e.g password                                        how it is stored, like this:-
//   "helloworld"  -------> hashing function ------->  "93723adabds92892892ndsn989288392nc288230823"  i.e it is hashed form which is unreadable for us

// Now during login time, when user entered the password, that password is firstly pass to hashing function & then the hashed form string given by hashing fn will be matched with the hashed form string stored in database for that user as the password
// And if both are correct, then it means correct password otherwise not the correct password
// Because hashing fn always gives the same hashed form string for the same input even if we pass that string again & again with some time intervals also.


// Hashing :-  
// For every input, there is a fixed length output
// They are one-way functions, we can't get input from output
// e.g of one-way functions :- modulus fn(which is called as absolute fn in JS or programming) e.g |x| = 5 for both x = +5 and x = -5, so based on output i.e 5, we can tell surely that whether the input is +5 or -5
// e.g modulo function i.e % => as 3 % 3 = 0 or 6%3=0 or 9%3=0, so based on output, we can tell what the input is.
// For a different input, there is a different output but of same length
// Small changes in input should bring large chnages in output

// SOme examples of well known hashing functions or algorithms are :-
// SHA-256(Secure Hash Algorithm 256‑bit), MD5(Message Digest 5), CRC(Cyclic Redundancy Check), bcrypt or etc.

// SHA-256 is an algorithm that converts a string of text into another string, called a hash. The hash is always the same length: exactly 64 hexadecimal characters long. This is equivalent to 256 bits, which is where the name comes from - "Secure Hashing Algorithm - 256". 
// Even if the input is empty, the hash will be 64 characters long, and in that specific scenario is: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
// The hashing algorithm is intentionally designed so that if the input changes just slightly, for example changing a letter from upper to lower case, or by adding a comma, the hash is completely different and bears no relation to what it was previously.

// But for practical cases, SHA-256 is not soo good method, so we don't use this method.

//SHA‑256 is Fast & Problem with Fast Hashing :-
// Attackers can run brute force or dictionary attacks extremely quickly.
// With GPUs or ASICs, they can test billions of SHA‑256 hashes per second.
// That means if you store passwords with plain SHA‑256, an attacker can crack weak passwords very fast.

// Why We Want Slow Hashing :-
// Slow hashing algorithms deliberately add computational cost.
// This makes brute force attacks impractical, even with powerful hardware.
// They also add salt (random data) to prevent rainbow table attacks.

// Examples of Slow Hashing Algorithms :-
// bcrypt → Adaptive cost factor, includes salt.
// scrypt → Memory‑hard, resists GPU attacks.
// Argon2 → Winner of the Password Hashing Competition, modern and secure.
// PBKDF2 → Iterative hashing, widely supported.


// Salting :- 
// Password salting is a technique to protect passwords stored in databases by adding the salt i.e a string of 32 or more characters and then hashing them.
// e.g salt = "%?@"
// and password = abc, then after salting, password became :- 'abc%?@'
// Salting ensures that even if two users have the same password, their hashes will be different.

//Why Salting is Important :-
// Without salting:-
// "password123" → always hashes to the same value (e.g., SHA‑256 output).
// Attackers can use precomputed tables to instantly match common hashes.
// With salting:-
// "password123" + salt1 → hash A
// "password123" + salt2 → hash B
// Even though the password is the same, the hashes differ because of the unique salt.

// Reverse Lookup Table? :-
// It focused on mapping hashes back to their original inputs.
// Since hashing is one‑way (you can’t “reverse” it mathematically), attackers build a reverse lookup table by brute force:
// Generate a huge list of possible inputs.
// Hash each input.
// Store the mapping: hash → original input.
// When they see a hash in a stolen database, they check if it exists in their table. If yes, they instantly know the original password.


// WHat is Passport in node js :-
// Passport.js is an authentication middleware for Node.js, most commonly used with Express applications. It provides a flexible, modular way to handle user authentication using strategies like username/password, OAuth (Google, Facebook, GitHub, etc.), and more, without enforcing a specific database or schema.
// Passport is authentication middleware for Node.js. Extremely flexible and modular, Passport can be unobtrusively dropped in to any Express-based web application. A comprehensive set of strategies support authentication using a username and password, Facebook, Twitter, and more.
// So it also support login using fackbook, twitter, linkdin, etc 

// What Passport.js Does :-
// Authentication Middleware: It sits between your routes and request handling, checking if a user is authenticated.

// 1. passport :-   so it is actually a npm package or library
// The core Passport.js library.
// Passport is Express-compatible authentication middleware for Node.js.
// Provides the middleware framework for authentication in Node.js/Express.
// By itself, it doesn’t know how to authenticate — it just defines the structure.
// You plug in strategies (like local, Google, GitHub) to handle actual authentication.
// Think of it as the “engine” of authentication.

// 2. passport-local :-
// A strategy plugin for Passport.
// Passport strategy for authenticating with a username and password.
// Implements authentication using a username + password (stored in your database).
// You define how to look up the user and verify the password.

// 3. passport-local-mongoose :-
// A Mongoose plugin that simplifies using passport-local with MongoDB.
// Passport-Local Mongoose is a Mongoose plugin that simplifies building username and password login with Passport.
// Automatically adds fields like username, hash, and salt to your Mongoose schema.
// Provides helper methods like:
// User.register() → to create a new user with hashed password.
// User.authenticate() → to verify login credentials.
// User.serializeUser() / User.deserializeUser() → for session handling.

// Passport.js is designed to let you combine multiple strategies in the same app. That means you can support both local login (username + password) and social login (Google, GitHub, Facebook, etc.) side by side.

// Now we need to install these :- 
// npm install passport
// npm install passport-local
// npm install passport-local-mongoose

// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// User Model :-
// user: username, password, email

// We can also define our own User however we like.
// Passport-local mongoose will add a username, hash and salt field to store the username, the hashed password and the salt value.

// Additionally, Passport-local mongoose adds some methods to our Schema.

//--------------------------------------------------------------------------------------------------------------
// Configuring Strategy :- i.e how can we apply some basic settings 

// passport.initialize() :-  
// A middleware that initializes passport
// passport.session() :- 
// A web application needs the ability to identify users as they browse from page to page.
// This series of requests and responses, each associated with the same user, is known as a session.
// passport.use(new LocalStrategy( User.authenticate() ))

// So internally, pbkdf2 hashing algorithm is used in passport.

//--------------------------------------------------------------------------------------------------------------
// Connectiong login Route with Passport :-
// How to check if the User is Logged In? :-
// req.isAuthenticated() is a method added by Passport to the request object. It returns true if the user is currently authenticated (i.e., logged in) and false otherwise.
// So we can use this method to check if the user is logged in or not. If it returns true, we can allow access to certain routes or features; if false, we can redirect them to a login page or show an error message. It’s a convenient way to protect routes that require authentication.



// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// MVC : Model, View, Controller :-
// Implement Design Pattern for Listings
// It can be defined as a framework for organizing code in a way that separates concerns and promotes maintainability. It divides an application into three interconnected components: Model, View, and Controller. Each component has a specific role in handling data, user interface, and application logic, respectively. This separation allows developers to manage complexity and make changes to one part of the application without affecting others. In the context of your Express application, you can structure your code using MVC principles to keep your routes, database interactions, and views organized and maintainable.
// MVC is a software architectural pattern that separates an application into three main components: Model, View, and Controller. This separation helps manage complexity and promotes organized code structure.
// Model: Represents the data and business logic of the application. It defines the structure of the data, interacts with the database, and contains methods to manipulate that data. In your case, this would be your Mongoose models (e.g., Listing, Review, User).
// View: Represents the user interface of the application. It displays data to the user and sends user commands to the controller. In your case, this would be your EJS templates that render HTML pages.
// Controller: Acts as an intermediary between the Model and the View. It processes incoming requests, interacts with the Model to retrieve or update data, and then selects a View to render the response. In your case, this would be your Express route handlers that manage the logic for each endpoint.

// MVC is just q way to write code in a more organized way. It is not a framework or library, it is just a design pattern. It is not mandatory to use MVC, but it can help you to write code in a more organized way. It can also help you to maintain your code in the long run.

// So here the core functionality of database is stored inside models folder here and the core functionality of frontend is stored inside views folder here.
// So the core functionality of backend we will store in the form of controller here.

// So here we will store all the callbacks which we used in listing routes or reviews routes or user routes in a separate file called as controller folder.


// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------   
// Router.route :-
// A way to group together routes with different verbs but same paths.
// router.route(path) actually Returns an instance of a single route which you can then use to handle HTTP verbs with optional middleware. Use router.route() to avoid duplicate route naming and thus typing errors.
// In simple terms, it allows you to define multiple HTTP method handlers for the same route path in a cleaner way. Instead of writing separate router.get(), router.post(), etc., you can chain them together using router.route().
// Example:
// router.route("/listings")
//     .get((req, res) => { /* handle GET /listings */ })
//     .post((req, res) => { /* handle POST /listings */ });
// SO here instead of writing two separate routes for GET and POST, we can group them together using router.route() which makes our code cleaner and more organized. It also helps to avoid typos in route paths since you only write the path once.


// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Image Upload :-
// In MongoDb, we can't store the files i.e images directly in the database, instead we can store the image in some cloud storage like AWS S3, Cloudinary, etc and then we can store the URL of that image in the database. So whenever we want to access that image, we can access it using that URL which is stored in the database. So here we will use Cloudinary for storing our images. It is a cloud service that provides an end-to-end image and video management solution including uploads, storage, manipulations, optimizations and delivery.
// Because MongoDB stores data in a JSON-like format, it’s not designed to handle large binary files like images directly. Because it has some limitations on document size (16MB), it’s not suitable for storing large files. 
// So we will make use of 3rd party cloud services like google, AWS, microsoft, etc.
// But here we are not on production level, so we will make use of less known cloud service & in that also, we will make use of its free version which can work well for our development level.
// so we will use that 3rd party cloud service for storing our files i.e images and then it will give us the URL of that image which we will store in our database and whenever we want to access that image, we can access it using that URL which is stored in the database. 

// Here currentyl, our form can only parse the urlencoded data, so we need to use some middleware to parse the multipart/form-data which is used for file uploads. So we will use multer for that. It is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files. It makes it easy to handle file uploads in your Express applications by parsing incoming form data and storing the uploaded files in a specified location on your server or in memory. Multer provides various options for configuring how files are stored and processed, making it a popular choice for handling file uploads in Node.js applications.
// So we will use enctype="multipart/form-data" in our form for uploading files and then we will use multer middleware to parse that multipart/form-data and then we will store that file in some cloud storage like Cloudinary and then we will store the URL of that image in our database.

// SO we will make use of multer for parsing the multipart/form-data.
// Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files. It is written on top of busboy for maximum efficiency.
// NOTE: Multer will not process any form which is not multipart (multipart/form-data).
// As it is a npm package, so we need to install it using :- npm install multer

// Here we will make use of the cloudinary npm package for uploading our images to cloudinary. It is a cloud service that provides an end-to-end image and video management solution including uploads, storage, manipulations, optimizations and delivery. It is a popular choice for handling media assets in web applications due to its ease of use and powerful features.
// So we will use cloudinary for storing our images and then we will store the URL of that image in our database and whenever we want to access that image, we can access it using that URL which is stored in the database.
// As it is a npm package, so we need to install it using :- npm install cloudinary

// .env file :-
// A .env file is a simple text file that contains environment variables for your application. It is used to store configuration settings and sensitive information (like API keys, database URLs, etc.) in a secure and organized way. The .env file is typically placed in the root directory of your project and is not committed to version control (e.g., Git) to keep sensitive data private.
// The dotenv package is a zero-dependency module that loads environment variables from a .env file into process.env. This allows you to access your configuration settings and sensitive information in your Node.js application without hardcoding them in your source code. It’s especially useful for managing different configurations for development, testing, and production environments.
// To use dotenv, you first need to install it using npm: npm install dotenv
// And we never commit or upload this .env file to github or any version control system as it contains sensitive information like API keys, database URLs, etc. So we will add this .env file in our .gitignore file to ignore it from being committed to version control. This way, we can keep our sensitive information secure and prevent it from being exposed publicly.

// Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env. 


// Store Files :-
// Multer Store Cloudinary
// here we will make use of two npm libraries to  use both multer and cloudinary together for storing our files i.e images in cloudinary using multer. So we will use multer for parsing the multipart/form-data and then we will use cloudinary for storing our images and then we will store the URL of that image in our database and whenever we want to access that image, we can access it using that URL which is stored in the database.
// npm install cloudinary 
// npm install multer-storage-cloudinary
// --------OR-----------
// npm install cloudinary multer-storage-cloudinary



// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Using Maps in our Project :-
// Here we will not make use of Google Maps APIs because for that we have to give our credit card details and then only we can use that, so instead of that we will make use of some other map APIs which are free to use and also they don't require any credit card details. 
// So here we will make use of Mapbox for that. It is a mapping and location data platform for developers. It provides APIs and tools to create custom maps, geocoding, and other location-based services. Mapbox allows you to integrate maps into your applications and customize them with your own data and styles. It is commonly used in web and mobile applications to display interactive maps and provide location-based features.
// We will use free version of Mapbox which is sufficient for our development level. It provides a generous free tier that allows you to make a certain number of map loads and geocoding requests per month without any cost. This makes it an excellent choice for development and testing purposes, as well as for small projects that do not require a large volume of map interactions. By using the free version of Mapbox, you can access powerful mapping features and create interactive maps without worrying about exceeding usage limits or incurring costs during the development phase.
// To use Mapbox, you need to sign up for a free account on the Mapbox website. Once you have an account, you can create an access token that will allow you to use Mapbox APIs in your application. You can then use this access token to make requests to Mapbox services, such as loading maps, geocoding addresses, or retrieving location data. The free version of Mapbox provides a generous amount of usage, making it a great option for development and small projects without the need for a credit card.

// Here we will make use of Mapbox GL JS library to add maps in our project.
// Mapbox GL JS is a client-side JavaScript library for building web maps and web applications with Mapbox's modern mapping technology. 
// You can use Mapbox GL JS to display Mapbox maps in a web browser or client, add user interactivity, and customize the map experience in your application.


// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Geocoding :-
// Geocoding is the process of converting addresses (like a street address) into geographic coordinates (like latitude and longitude), which you can use to place markers on a map, or position the map.

// We will make use of Mapbox Geocoding API for that. It is a service provided by Mapbox that allows you to convert addresses into geographic coordinates (latitude and longitude) and vice versa. The Mapbox Geocoding API is commonly used in web and mobile applications to enable location-based features, such as searching for places, displaying maps, and providing directions. By using the Mapbox Geocoding API, you can easily integrate geocoding functionality into your application and enhance the user experience with location-based services.
// Here we will use mapbox-sdk which is a JavaScript library that provides an interface to interact with Mapbox APIs, including the Geocoding API. It allows you to easily make requests to Mapbox services and handle the responses in your application. By using the mapbox-sdk, you can simplify the process of integrating Mapbox's geocoding functionality into your web application and enhance the user experience with location-based features. To use the mapbox-sdk, you need to install it using npm: npm install @mapbox/mapbox-sdk
// It is available as a npm package, so we need to install it using :- npm install @mapbox/mapbox-sdk
// ALl things related to this are present on github under the name of mapbox-sdk, so you can check that for more details and documentation. It is a JavaScript library that provides an interface to interact with Mapbox APIs, including the Geocoding API. It allows you to easily make requests to Mapbox services and handle the responses in your application. By using the mapbox-sdk, you can simplify the process of integrating Mapbox's geocoding functionality into your web application and enhance the user experience with location-based features. To use the mapbox-sdk, you need to install it using npm: npm install @mapbox/mapbox-sdk


// GeoJSON :-
// GeoJSON is a format for storing geographic points and polygons. MongoDB has excellent support for geospatial queries on GeoJSON objects. 
// The most simple structure in GeoJSON is a point. Below is an example point representing the approximate location of San Francisco. Note that longitude comes first in a GeoJSON coordinate array, not latitude.
// {
//   "type" : "Point",
//   "coordinates" : [
//     -122.5,
//     37.7
//   ]
// }

// Mapbox return the geometry data actually in GeoJSON format only.

// WHy we prefer GeoJSON? :-    
// GeoJSON is a widely used format for representing geographic data, and MongoDB has built-in support for geospatial queries on GeoJSON objects. This makes it easier to store and query location data in MongoDB when using GeoJSON format. Additionally, many mapping libraries and APIs, including Mapbox, use GeoJSON as a standard format for representing geographic features, so using GeoJSON allows for seamless integration with these tools. Overall, using GeoJSON simplifies the handling of geographic data in MongoDB and enhances compatibility with mapping services.


//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Mongo Atlas :- Cloud Database Service
// It is a cloud database service provided by MongoDB. It allows you to host, manage, and scale your MongoDB databases in the cloud. With MongoDB Atlas, you can easily create and deploy MongoDB clusters without having to worry about infrastructure management. It provides features like automated backups, monitoring, security, and scalability, making it a convenient choice for developers who want to use MongoDB without the hassle of managing their own database servers. MongoDB Atlas supports various cloud providers such as AWS, Google Cloud Platform, and Microsoft Azure, giving you flexibility in choosing where to host your database. Overall, MongoDB Atlas simplifies the process of using MongoDB in the cloud and provides a reliable and scalable solution for your database needs.
// So we will use MongoDB Atlas for hosting our database in the cloud. It provides a convenient and scalable solution for managing MongoDB databases without the need for self-hosting. With MongoDB Atlas, you can easily create and deploy MongoDB clusters, and it offers features like automated backups, monitoring, security, and scalability. This allows you to focus on developing your application while MongoDB Atlas takes care of the database management. Additionally, MongoDB Atlas supports various cloud providers such as AWS, Google Cloud Platform, and Microsoft Azure, giving you flexibility in choosing where to host your database. Overall, using MongoDB Atlas simplifies the process of using MongoDB in the cloud and provides a reliable and scalable solution for your database needs.

// SO we will shift our database from local MongoDB to MongoDB Atlas which is a cloud database service provided by MongoDB. It allows you to host, manage, and scale your MongoDB databases in the cloud. 



// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Mongo session store :-
// By default, express-session stores session data in memory, which is not suitable for production environments. To store session data persistently, we can use a MongoDB session store. This allows us to save session data in a MongoDB database, ensuring that sessions are maintained even if the server restarts. A popular package for this is connect-mongo, which provides a MongoDB-based session store for Express applications. By using a MongoDB session store, we can ensure that user sessions are reliable and scalable in a production environment.
// So we will use connect-mongo for storing our session data in MongoDB. It is a MongoDB-based session store for Express applications. By using connect-mongo, we can ensure that user sessions are reliable and scalable in a production environment, as the session data will be stored persistently in a MongoDB database rather than in memory. This allows us to maintain user sessions even if the server restarts, providing a better user experience and improving the overall reliability of our application. To use connect-mongo, you need to install it using npm: npm install connect-mongo

// Now we need to require it but firstly we also need to require the express-session package because connect-mongo is a session store for express-session, so we need to use it with express-session. So we will require both express-session and connect-mongo in our app.js file and then we will use connect-mongo as a session store for express-session. This way, our session data will be stored in MongoDB instead of in memory, which is more suitable for production environments. By using connect-mongo, we can ensure that user sessions are reliable and scalable, as the session data will be stored persistently in a MongoDB database rather than in memory. This allows us to maintain user sessions even if the server restarts, providing a better user experience and improving the overall reliability of our application.

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Deployment :-
//- render
//- netlify
//- cyclic etc.


// .gitignore :-
// A .gitignore file is a text file that tells Git which files or directories to ignore in a project. It is used to prevent certain files from being tracked and committed to the Git repository. This is especially useful for excluding sensitive information (like API keys, database credentials, etc.) or files that are not relevant to the project (like node_modules, log files, etc.). By adding these files or directories to the .gitignore file, you can ensure that they are not accidentally included in commits and pushed to remote repositories, keeping your project clean and secure. The .gitignore file should be placed in the root directory of your project and can be customized according to your needs.
