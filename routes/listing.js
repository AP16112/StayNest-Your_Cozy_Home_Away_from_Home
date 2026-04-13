// Here we will use this 'routes' folder for using Express Router actually.

// Here this 'listing.js' file is actually the router file for the 'listing' model
// And in this file, we will write all the routes related to listings.

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

// const router = express.Router();
// here now this router will have access to all method like get, post, delete, etc
// so instead of using app.get() or app.post(), now we will use router.get() or router.post() here
// As here in this router file, we haven't created the app, so we don't have access to app here

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// SO here we will firstly require the express
const express = require("express");

// And then we will create our router object here
const router = express.Router();  //Creates a new router instance.
// This router is like a mini Express app that can handle its own routes and middleware.
// It has access to all HTTP methods (get, post, put, delete, etc.), just like app does.
// So instead of writing everything in app.js with app.get() or app.post(), you define routes here with router.get() or router.post().

// In Mongoose, creating new models means creating new collections.
// Now we can require the 'Listing' model in app.js file using :- const Listing = require("../models/listing");
// const Listing = require("../models/listing");
const Listing = require("../models/listing.js");  // here we can also write like this, but generally we write like this only because it is a standard way to write it, so it is better to write like this only
// As we know that for this Model, by-default mongoose will create a collection called as 'listings' for this model


// Here we are requiring this wrapAsync fn here
const wrapAsync = require("../utils/wrapAsync.js");


const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

// Here we are requiring this listingController here, so that we can use the functions which are present in this listingController here, so that we can keep our route file clean and easy to read and also easy to maintain.
const listingController = require("../controllers/listings.js");

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

const multer  = require('multer');

const {storage} = require("../cloudConfig.js");  // here we are requiring this storage object from this cloudConfig.js file, so that we can use this storage object in multer configuration here for storing our files in cloudinary using multer-storage-cloudinary package.

// So here we will configure multer to use this storage engine for storing our files in cloudinary using multer-storage-cloudinary package, so that we can keep our route file clean and easy to read and also easy to maintain. So here we will use this upload middleware in our route where we want to handle the file upload and then store that file in cloudinary and then store the URL of that image in our database, so that we can keep our route file clean and easy to read and also easy to maintain.
// const upload = multer({ storage: storage });
const upload = multer({ storage });  // here we can also write like this, but generally we write like this only because it is a standard way to write it, so it is better to write like this only

// Now we will make use of this upload.single('avatar') middleware in the route where we want to handle the file upload. The 'avatar' is the name of the form field that contains the file. This middleware will process the incoming request, extract the file from the specified form field, and save it to the 'uploads/' directory. After processing, it will add a 'file' property to the request object (req.file) containing information about the uploaded file, such as its filename, path, size, etc. We can then use this information to further process the file (e.g., move it to cloud storage, save its URL in the database, etc.) in our route handler.


// As here we are using this :- app.use("/listings", listings);   in app.js file.
// So no need to start the path from '/listings' here as we can starts the path after that now.
// Organized routes: All routes inside the listings router will automatically be prefixed with /listings.
// Avoids repetition: You don’t have to write /listings in every route definition inside the router file.
// Clear structure: Makes it obvious that these routes belong to the “listings” resource.

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

// Now we will make use of this upload.single('avatar') middleware in the route where we want to handle the file upload. The 'avatar' is the name of the form field that contains the file. This middleware will process the incoming request, extract the file from the specified form field, and save it to the 'uploads/' directory. After processing, it will add a 'file' property to the request object (req.file) containing information about the uploaded file, such as its filename, path, size, etc. We can then use this information to further process the file (e.g., move it to cloud storage, save its URL in the database, etc.) in our route handler.

router.route("/")
    // So here this 'index' function is a asynchronous fn which is used to render all the listings present in the database on the index page of listings, so here we will write the logic to find all the listings from the database and then render those listings on the index page of listings here in this 'index' function here, so that we can call this 'index' function in our route file to render all the listings on the index page of listings.
    .get(wrapAsync(listingController.index))     // here we are calling this index function which is present in this listingController here, so that we can keep our route file clean and easy to read and also easy to maintain.
    .post(isLoggedIn, upload.single('listing[image]'), validateListing,  wrapAsync( listingController.createListing));   // here we are calling this createListing function which is present in this listingController here, so that we can keep our route file clean and easy to read and also easy to maintain.
    // So here this 'createListing' function is used to create a new listing and then add that new listing to the database, so here we will write the logic to create a new listing and then add that new listing to the database here in this 'createListing' function here, so that we can call this 'createListing' function in our route file to create a new listing and then add that new listing to the database.));

// SO here in this POST route, we are using this upload.single('listing[image]') middleware to handle the file upload for the image of the listing. The 'listing[image]' is the name of the form field that contains the file. This middleware will process the incoming request, extract the file from the specified form field, and save it to the 'uploads/' directory. After processing, it will add a 'file' property to the request object (req.file) containing information about the uploaded file, such as its filename, path, size, etc. We can then use this information to further process the file (e.g., move it to cloud storage, save its URL in the database, etc.) in our route handler. Here we are just sending back the req.body for testing purposes to see if we are able to parse the multipart/form-data correctly or not.


// Here we are already covering the index and create route in the above router.route() method, so no need to write separate routes for index and create route here now.
// .single() is used to handle single file upload, so it accepts the name of the form field that contains the file as an argument. In our case, the form field name is 'listing[image]', so we are using upload.single('listing[image]') to handle the file upload for that specific form field.


// New Route :-
// GET --> '/listing/new'  =>  serve the form i.e it will take the inputs using GET request

// Now we can use this 'isLoggedIn' middleware anywhere in the routes where we want to check whether the user is logged in or not, so here we will use this 'isLoggedIn' middleware in this GET route for new listing, so that only logged in user can access this route to create new listing, so here we will use this 'isLoggedIn' middleware in this GET route for new listing like this :- router.get("/new", isLoggedIn, (req, res) => { ... })
router.get("/new", isLoggedIn, listingController.renderNewForm);   // here we are calling this renderNewForm function which is present in this listingController here, so that we can keep our route file clean and easy to read and also easy to maintain.
// So here this 'renderNewForm' function is used to render the form for creating new listing, so here we will write the logic to render the form for creating new listing here in this 'renderNewForm' function here, so that we can call this 'renderNewForm' function in our route file to render the form for creating new listing.
 
// Here we need to write this 'NewRoute' before this "/:id" route because as we know in JS, code is executed from top to bottom
// So if show route is written above new route, then when GET request is send to 'listings/new' path, then this 'new' gets treated as id i.e like 'listings/:id' path
// Then in that case, id = new, & it try to search 'new' as id in database & when not found, it gives error
// So we need to write /listings/new route above the /listings/:id  route, so that both works correctly.    


// Here this 'upload.single('listing[image]')' middleware is used to handle the file upload for the image of the listing in the POST route.
// Here as soon as the file is uploaded, this 'upload.single('listing[image]')' middleware will add a 'file' property to the request object (req.file) containing information about the uploaded file, such as its filename, path, size, etc. We can then use this information to further process the file (e.g., move it to cloud storage, save its URL in the database, etc.) in our route handler. Here we are just sending back the req.body for testing purposes to see if we are able to parse the multipart/form-data correctly or not.
// SO here firstly multer will parse the incoming file & then save the image in cloudinary using multer-storage-cloudinary package and then it will give us the URL of that image which is stored in cloudinary using multer-storage-cloudinary package, so we can easily access that URL using this req.file.path and then we can store that URL in our database to access that image whenever we want to access it in future. So here we will write the logic to handle the file upload for the image of the listing and then store the URL of that image in our database here in this 'createListing' function here, so that we can call this 'createListing' function in our route file to handle the file upload for the image of the listing and then store the URL of that image in our database.
router.route("/:id")
    // Here we need to use this ':id' in the path because we need to know which listing we want, so we will pass the id of that listing in the path itself, so that we can easily find that listing in the database using that id.
    // So here this 'showListing' function is used to render the show page of a listing, so here we will write the logic to find the listing based on the id from the database and then render that listing on the show page of that listing here in this 'showListing' function here, so that we can call this 'showListing' function in our route file to render the show page of that listing.
    .get( wrapAsync( listingController.showListing))   // here we are calling this showListing function which is present in this listingController here, so that we can keep our route file clean and easy to read and also easy to maintain.
    // So here this 'updateListing' function is used to update a listing, so here we will write the logic to find the listing based on the id from the database and then update that listing with this new listing value in the database here in this 'updateListing' function here, so that we can call this 'updateListing' function in our route file to update a listing.
    .put( isLoggedIn, isOwner, upload.single('listing[image]'),  validateListing, wrapAsync( listingController.updateListing))   // here we are calling this updateListing function which is present in this listingController here, so that we can keep our route file clean and easy to read and also easy to maintain.
    // So here this 'destroyListing' function is used to delete some listing document from the database based on id, so here we will write the logic to find the listing based on the id from the database and then delete that listing from the database here in this 'destroyListing' function here, so that we can call this 'destroyListing' function in our route file to delete some listing document from the database based on id.
    .delete( isLoggedIn, isOwner, wrapAsync( listingController.destroyListing));   // here we are calling this destroyListing function which is present in this listingController here, so that we can keep our route file clean and easy to read and also easy to maintain.

// Here we are already covering the show, update and destroy route in the above router.route() method, so no need to write separate routes for show, update and destroy route here now.



// Edit & Update Route :-
// Used to edit previous listing in database based on id

// It will actually consists of two routes :-
// Edit Route :-
// GET --> '/listings/:id/edit'  --> to get form to edit the listing, based on id.
// This is another API which shows the 'Edit route' i.e it is used to serve the edit form i.e it will show the form to edit the content of listing

// Here we need to use this ':id' in the path because we need to know which listing we want to edit, so we will pass the id of that listing in the path itself, so that we can easily find that listing in the database using that id and then we can easily edit that listing, so here we will use this ':id' in the path to pass the id of that listing which we want to edit, so here we will use this ':id' in the path like this :- '/listings/:id/edit'
// Now we can use this 'isLoggedIn' middleware anywhere in the routes where we want to check whether the user is logged in or not, so here we will use this 'isLoggedIn' middleware in this GET route for new listing, so that only logged in user can access this route to edit the listing, so here we will use this 'isLoggedIn' middleware in this GET route for edit listing like this :- router.get("/:id/edit", isLoggedIn, wrapAsync( async (req, res) => { ... })
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync( listingController.renderEditForm));   // here we are calling this renderEditForm function which is present in this listingController here, so that we can keep our route file clean and easy to read and also easy to maintain.
// So here this 'renderEditForm' function is used to render the form for editing the listing, so here we will write the logic to find the listing based on the id from the database and then render that listing on the edit form of that listing here in this 'renderEditForm' function here, so that we can call this 'renderEditForm' function in our route file to render the form for editing that listing.




// So now we will write all the routes of listing here like router.get() or router.post() or etc.
//-------------------------------------------------------------------------------------------------------------------------------
// Index Route :-
// GET  -->  '/listings' index route  -->  to show all the listings of DB  => it will fetch & show all the listings

// As here we are using this :- app.use("/listings", listings);   in app.js file.
// So no need to start the path from '/listings' here as we can starts the path after that now.
// router.get("/listings", wrapAsync(async (req, res) => {     
// router.get("/", wrapAsync(listingController.index));     // here we are calling this index function which is present in this listingController here, so that we can keep our route file clean and easy to read and also easy to maintain.
// So here this 'index' function is a asynchronous fn which is used to render all the listings present in the database on the index page of listings, so here we will write the logic to find all the listings from the database and then render those listings on the index page of listings here in this 'index' function here, so that we can call this 'index' function in our route file to render all the listings on the index page of listings.


//-------------------------------------------------------------------------------------------------------------------------------
// Here we need to write this 'New Route' before writing the 'SHow Route' here because as we know in JS, code is executed from top to bottom
// So if show route is written above new route, then when GET request is send to 'listings/new' path, then this 'new' gets treated as id i.e like 'listings/:id' path
// Then in that case, id = new, & it try to search 'new' as id in database & when not found, it gives error
// So we need to write /listings/new route above the /listings/:id  route, so that both works correctly.


// New & Create Routes :- 
// Used to ADD new listing into the DB

// It will actually consists of two routes :-
// New Route :-
// GET --> '/listing/new'  =>  serve the form i.e it will take the inputs using GET request

// Now we can use this 'isLoggedIn' middleware anywhere in the routes where we want to check whether the user is logged in or not, so here we will use this 'isLoggedIn' middleware in this GET route for new listing, so that only logged in user can access this route to create new listing, so here we will use this 'isLoggedIn' middleware in this GET route for new listing like this :- router.get("/new", isLoggedIn, (req, res) => { ... })
// router.get("/new", isLoggedIn, listingController.renderNewForm);   // here we are calling this renderNewForm function which is present in this listingController here, so that we can keep our route file clean and easy to read and also easy to maintain.
// So here this 'renderNewForm' function is used to render the form for creating new listing, so here we will write the logic to render the form for creating new listing here in this 'renderNewForm' function here, so that we can call this 'renderNewForm' function in our route file to render the form for creating new listing.
 

// Create Route :-
// POST --> '/listings'   => add the new listing  i.e it will make use of POST request

// This will add this new listing to the database

// Now we will pass this validateListing as the middleware here now.
// router.post("/", isLoggedIn, validateListing, wrapAsync( listingController.createListing));   // here we are calling this createListing function which is present in this listingController here, so that we can keep our route file clean and easy to read and also easy to maintain.
// So here this 'createListing' function is used to create a new listing and then add that new listing to the database, so here we will write the logic to create a new listing and then add that new listing to the database here in this 'createListing' function here, so that we can call this 'createListing' function in our route file to create a new listing and then add that new listing to the database.));


//-------------------------------------------------------------------------------------------------------------------------------

// Here we need to write this 'New Route' before writing the 'SHow Route' here because as we know in JS, code is executed from top to bottom
// So if show route is written above new route, then when GET request is send to 'listings/new' path, then this 'new' gets treated as id i.e like 'listings/:id' path
// Then in that case, id = new, & it try to search 'new' as id in database & when not found, it gives error
// So we need to write /listings/new route above the /listings/:id  route, so that both works correctly.

// Show Route :- It actually READ operations of CRUD
// GET --> '/listings/:id'  show route  --> it is used to show or view the specific individual listing data

// Here we need to use this ':id' in the path because we need to know which listing we want, so we will pass the id of that listing in the path itself, so that we can easily find that listing in the database using that id.
// router.get("/:id", wrapAsync( listingController.showListing));   // here we are calling this showListing function which is present in this listingController here, so that we can keep our route file clean and easy to read and also easy to maintain.
// So here this 'showListing' function is used to render the show page of a listing, so here we will write the logic to find the listing based on the id from the database and then render that listing on the show page of that listing here in this 'showListing' function here, so that we can call this 'showListing' function in our route file to render the show page of that listing.


//-------------------------------------------------------------------------------------------------------------------------------
// Edit & Update Route :-
// Used to edit previous listing in database based on id

// It will actually consists of two routes :-
// Edit Route :-
// GET --> '/listings/:id/edit'  --> to get form to edit the listing, based on id.
// This is another API which shows the 'Edit route' i.e it is used to serve the edit form i.e it will show the form to edit the content of listing

// Here we need to use this ':id' in the path because we need to know which listing we want to edit, so we will pass the id of that listing in the path itself, so that we can easily find that listing in the database using that id and then we can easily edit that listing, so here we will use this ':id' in the path to pass the id of that listing which we want to edit, so here we will use this ':id' in the path like this :- '/listings/:id/edit'
// Now we can use this 'isLoggedIn' middleware anywhere in the routes where we want to check whether the user is logged in or not, so here we will use this 'isLoggedIn' middleware in this GET route for new listing, so that only logged in user can access this route to edit the listing, so here we will use this 'isLoggedIn' middleware in this GET route for edit listing like this :- router.get("/:id/edit", isLoggedIn, wrapAsync( async (req, res) => { ... })
// router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync( listingController.renderEditForm));   // here we are calling this renderEditForm function which is present in this listingController here, so that we can keep our route file clean and easy to read and also easy to maintain.
// So here this 'renderEditForm' function is used to render the form for editing the listing, so here we will write the logic to find the listing based on the id from the database and then render that listing on the edit form of that listing here in this 'renderEditForm' function here, so that we can call this 'renderEditForm' function in our route file to render the form for editing that listing.


// A PATCH request in HTTP is used to partially update an existing resource. 
// Unlike PUT, which replaces the entire resource, PATCH lets you send only the fields you want to change.
// PATCH request takes input in the request body. That’s how you tell the server which fields to update and what values to set

// PATCH → Partial update. You send only the fields you want to change (like just content).
// PUT → Full replacement. You’re expected to send the entire resource (all fields: id, username, content) and overwrite the existing one.

// So here we will make use of PUT request actually

// Update Route :-
// PUT --> '/listings/:id'  --> to update the listing in the database

// So here we will firstly check whether the user is logged in or not using this 'isLoggedIn' middleware, so that only logged in user can access this route to update the listing, so here we will use this 'isLoggedIn' middleware in this PUT route for update listing like this :- router.put("/:id", isLoggedIn, wrapAsync( async (req, res) => { ... })
// Now we also need to check whether the currently logged in user is the owner of this listing or not, so that only owner of this listing can update this listing, so here we will use this 'isOwner' middleware in this PUT route for update listing like this :- router.put("/:id", isLoggedIn, isOwner, wrapAsync( async (req, res) => { ... })
// router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync( listingController.updateListing));   // here we are calling this updateListing function which is present in this listingController here, so that we can keep our route file clean and easy to read and also easy to maintain.
// So here this 'updateListing' function is used to update a listing, so here we will write the logic to find the listing based on the id from the database and then update that listing with this new listing value in the database here in this 'updateListing' function here, so that we can call this 'updateListing' function in our route file to update a listing.


//-------------------------------------------------------------------------------------------------------------------------------
// Destroy Route :-
// It is used to delete some listing document from the database based on id
// DELETE --> '/listings/:id' Destroy route --> to delete some listing

// router.delete("/:id", isLoggedIn, isOwner, wrapAsync( listingController.destroyListing));   // here we are calling this destroyListing function which is present in this listingController here, so that we can keep our route file clean and easy to read and also easy to maintain.
// So here this 'destroyListing' function is used to delete some listing document from the database based on id, so here we will write the logic to find the listing based on the id from the database and then delete that listing from the database here in this 'destroyListing' function here, so that we can call this 'destroyListing' function in our route file to delete some listing document from the database based on id.


// Now we will export this router object, so that we can use all these router.get() or router.post() etc inside the app.js directly by creating them here instead of creating them in app.js
module.exports = router;



// Connectiong login Route with Passport :-
// How to check if the User is Logged In? :-
// req.isAuthenticated() is a method added by Passport to the request object. It returns true if the user is currently authenticated (i.e., logged in) and false otherwise.
// So we can use this method to check if the user is logged in or not. If it returns true, we can allow access to certain routes or features; if false, we can redirect them to a login page or show an error message. It’s a convenient way to protect routes that require authentication.

