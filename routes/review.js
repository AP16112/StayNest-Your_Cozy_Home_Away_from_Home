// Here we will use this 'routes' folder for using Express Router actually.

// Here this 'review.js' file is actually the router file for the 'review' model
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
// We need mergeParams: true in Express when working with nested routers because by default, a child router does not inherit the route parameters defined in its parent.
// so we will use this :- const router = express.Router({ mergeParams: true });
const router = express.Router({ mergeParams: true });  //Creates a new router instance.
// This router is like a mini Express app that can handle its own routes and middleware.
// It has access to all HTTP methods (get, post, put, delete, etc.), just like app does.
// So instead of writing everything in app.js with app.get() or app.post(), you define routes here with router.get() or router.post().


// Here we are requiring this wrapAsync fn here
const wrapAsync = require("../utils/wrapAsync.js");

const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");

// Here we are requiring this listingController here, so that we can use the functions which are present in this listingController here, so that we can keep our route file clean and easy to read and also easy to maintain.
const reviewController = require("../controllers/reviews.js");


// As here we are using this :- app.use("/listings/:id/reviews", reviews);   in app.js file.
// So no need to start the path from '/listings/:id/reviews' here as we can starts the path after that now.
// Organized routes: All routes inside the reviews router will automatically be prefixed with /listings/:id/reviews.
// Avoids repetition: You don’t have to write /listings/:id/reviews in every route definition inside the router file.
// Clear structure: Makes it obvious that these routes belong to the "reviews" resource.


// Route for creating Reviews in related database manner:-
// Here we will use this POST Route to store review in database & also along with that also store for which listing this review is created

// As here we are using this :- app.use("/listings/:id/reviews", reviews);   in app.js file.
// So no need to start the path from '/listings/:id/reviews' here as we can starts the path after that now.
// As this is '/listings/:id/reviews' common part actually 
// router.post("/listings/:id/reviews", validateReview, wrapAsync( async(req, res) => {
// Now we can use this 'isLoggedIn' middleware anywhere in the routes where we want to check whether the user is logged in or not.
router.post("/", isLoggedIn, validateReview, wrapAsync( reviewController.createReview));   // here we are calling this createReview function which is present in this reviewController here, so that we can keep our route file clean and easy to read and also easy to maintain.
// So here this 'createReview' function is used to create a new review for a listing, so here we will write the logic to create a new review for a listing in this 'createReview' function here, so that we can call this 'createReview' function in our route file to create a new review for a listing.


// So, for server side validation, we need to do this:-
// 1. create Joi schema
// 2. create a Schema validate fn
// 3. And then pass this fn as middleware to the app.post() method for reviews

//-------------------------------------------------------------------------------------------------------------------------------
// Route for deleting Reviews in related database manner:-
// here we delete request will come on this route '/listings/:id/reviews/:reviewId'
// because we want to delete reviews as well as we also need to remove their reference from their respective listing document also

// Here id --> listing document id
// And reviewId --> id of review docuemnt present in this current listing
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync( reviewController.destroyReview));   // here we are calling this destroyReview function which is present in this reviewController here, so that we can keep our route file clean and easy to read and also easy to maintain.
// So here this 'destroyReview' function is used to delete a review, so here we will write the logic to find the review based on the reviewId from the database and then delete that review from the database here in this 'destroyReview' function here, so that we can call this 'destroyReview' function in our route file to delete a review.


// here we will make use of Mongo $pull operator
// The $pull operator removes from an existing array all instances of a value or values that match a specific condition.
// $pull removes all instances of a value (or values matching a condition) from an array field in a document.
// It’s like saying: “Go into this array and delete anything that matches my filter.”



// Now we will export this router object, so that we can use all these router.get() or router.post() etc inside the app.js directly by creating them here instead of creating them in app.js
module.exports = router;