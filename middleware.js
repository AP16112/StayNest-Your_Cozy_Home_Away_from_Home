
// Here we are requiring this Listing model here, so that we can use it.
const Listing = require("./models/listing.js");  // here we can also write like this, but generally we write like this only because it is a standard way to write it, so it is better to write like this only
// As we know that for this Model, by-default mongoose will create a collection called as 'listings' for this model

// Here we are requiring this Review model here, so that we can use it.
const Review = require("./models/review.js");  // here we can also write like this, but generally we write like this only because it is a standard way to write it, so it is better to write like this only
// As we know that for this Model, by-default mongoose will create a collection called as 'reviews' for this model


// Here we will firstly require this custom error class using 'ExpressError' js file here to use it.
const ExpressError = require("./utils/ExpressError.js");

// Now we will require the Joi schema here to use it for server side validation
// Now this 'schema.js' will give us a object which can contains many object schemas, so we will use destructuring to access each schema
// Now we are currently requiring these schemas in this.
const { listingSchema, reviewSchema } = require("./schema.js");


// Connectiong login Route with Passport :-
// How to check if the User is Logged In? :-
// req.isAuthenticated() is a method added by Passport to the request object. It returns true if the user is currently authenticated (i.e., logged in) and false otherwise.
// So we can use this method to check if the user is logged in or not. If it returns true, we can allow access to certain routes or features; if false, we can redirect them to a login page or show an error message. It’s a convenient way to protect routes that require authentication.

// here we will create a middleware function to check whether the user is logged in or not and we will use this middleware function in the routes where we want to check whether the user is logged in or not. So we will create this middleware function in a separate file called middleware.js and we will export this middleware function from that file and we will require that file in the routes where we want to use this middleware function.

// So here we will create a middleware function called isLoggedIn which will check whether the user is logged in or not and if the user is not logged in, then it will redirect the user to the login page and if the user is logged in, then it will allow the user to access the route.
module.exports.isLoggedIn = (req, res, next) => {
    // console.log(req.user);
    // When you do this, you’re inspecting the user object that Passport attaches to every request once a user is authenticated.
    // SO Login success → Passport calls serializeUser and stores the user’s ID in the session.
    // Subsequent requests → Passport reads the session cookie, finds the stored ID, and calls deserializeUser.
    // Result → The full user document (fetched from MongoDB) is attached to req.user.
    // If the user is not logged in → req.user is undefined. If the user is logged in → req.user is the Mongoose user object returned by deserializeUser.

    // console.log(req);
    // THis req object contains many informations like req.user, info about path trying to access, etc. So we can use this req object to check whether the user is logged in or not by checking the value of req.user. If req.user is undefined, then it means that the user is not logged in and if req.user is defined, then it means that the user is logged in.

    // console.log(req.path, "..", req.originalUrl);
    // Here this req.path will give us the path of the route which we are trying to access and req.originalUrl will give us the original url of the route which we are trying to access. So we can use these two properties to check whether the user is trying to access a protected route or not and if the user is trying to access a protected route, then we can redirect the user to the login page and after successful login, we can redirect the user back to the original url which he was trying to access before login.
    // So we want to redirect the user back to the original url after successful login, so we can store the original url in the session before redirecting the user to the login page and after successful login, we can redirect the user back to that original url which we stored in the session. So we can use req.session.returnTo to store the original url in the session and after successful login, we can redirect the user back to that original url using req.session.returnTo.

    if(!req.isAuthenticated()) {
        // redirect URL after login :-
        req.session.redirectUrl = req.originalUrl;  // here we are storing the original url in the session before redirecting the user to the login page, so that after successful login, we can redirect the user back to that original url which he was trying to access before login.
        // Now all methods & middlewares will have access to this req.session.redirectUrl variable, so we can use this variable in the login route to redirect the user back to that original url after successful login.

        req.flash("error", "you must be logged in to create listing!");

        return res.redirect("/login");
    }
    // SO we must need to use return because Even though res.redirect() sends a response, the function doesn’t automatically stop. The code continues to the next line, which tries to call res.render().
    // That means Express attempts to send two responses for the same request, which triggers the error: Error: Can't set headers after they are sent.

    next();
}


// Now we will create another middleware to store the redirectUrl in locals variable, so that we can use that variable in the render method of the login route to redirect the user back to that original url after successful login.
// Because passport don't have access to locals variable, so it cannot remove these variables.
module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }

    next();
};



// Here we will create another middleware to perform the Authorization for listing, so that only the owner of this listing can edit this listing, so here we are checking whether the currently logged in user is the owner of this listing or not, if it is not the owner of this listing, then it will simply redirect back to show route of this listing without updating this listing in the database and also showing the error message using flash, otherwise if it is the owner of this listing, then it will update this listing in the database with this new listing value.
module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;

    let listing = await Listing.findById(id);

    // So here we are actually setting the Authorization for editing this listing, so that only the owner of this listing can edit this listing, so here we are checking whether the currently logged in user is the owner of this listing or not, if it is not the owner of this listing, then it will simply redirect back to show route of this listing without updating this listing in the database and also showing the error message using flash, otherwise if it is the owner of this listing, then it will update this listing in the database with this new listing value.
    // Here this 'currentUser' is the locals variable which we have defined to store the value of req.user in it, so that we can easily access this currentUser variable in our ejs files without passing it in the render method of each route, so that we can easily access the details of currently logged in user in our ejs files using this currentUser variable.
    // Here currentUser._id actually refers to the _id of the currently logged in user & listing.owner refers to the _id of the owner of the current listing & this .equals() method is used to compare these two _id values
    if(!listing.owner._id.equals(res.locals.currentUser._id)){
        req.flash("error", "You are not the owner of this listing");

        return res.redirect(`/listings/${id}`);   // it will redirect back to Show Route actually now.
    }
    // Here we must need to use return because Even though res.redirect() sends a response, the function doesn’t automatically stop. The code continues to the next line, which tries to call res.render().
    // That means Express attempts to send two responses for the same request, which triggers the error: Error: Can't set headers after they are sent.

    next();
};


// Middleware fn for Validation of schema for listing using Joi:-  It is used to perform server-side validation for listings
module.exports.validateListing = (req, res, next) => {
    // Here you’re asking Joi to check the incoming request body against your schema rules.
    // Return value → Joi returns an object with two keys:
    // error → Contains details if validation fails (e.g., missing field, wrong type).
    // value → The validated (and possibly sanitized) data.
    let { error } = listingSchema.validate(req.body);   // here we are extracting the error from the result given by this .validate()
  
    if(error){    // so if error exists in this result
        // So here it is taking Joi’s validation error details and turning them into a single readable string.
        // error.details → When Joi validation fails, the error object contains a details array.
        // Each item in that array describes one validation problem (e.g., “title is required”, “price must be greater than 0”).
        // .map((element) => element.message) → Loops through each error detail and extracts just the human‑friendly message string.
        // .join(",") → Combines all those messages into one string, separated by commas.
        // so, Instead of sending back a bulky Joi error object, you can return a clean, readable error message to the client.
        let errorMsg = error.details.map((element) => element.message).join(",");
        throw new ExpressError(400, errorMsg);
    } else {
        next();   // If validation passes, next() lets Express continue to your route handler.
    }
}
// Now we need to pass this fn as middleware in the app.post() of listing creation for server-side validation.



// Middleware fn for Validation of schema for review using Joi:-  It is used to perform server-side validation for reviews
module.exports.validateReview = (req, res, next) => {
    // Here you’re asking Joi to check the incoming request body against your schema rules.
    // Return value → Joi returns an object with two keys:
    // error → Contains details if validation fails (e.g., missing field, wrong type).
    // value → The validated (and possibly sanitized) data.
    let { error } = reviewSchema.validate(req.body);   // here we are extracting the error from the result given by this .validate()
  
    if(error){    // so if error exists in this result
        // So here it is taking Joi’s validation error details and turning them into a single readable string.
        // error.details → When Joi validation fails, the error object contains a details array.
        // Each item in that array describes one validation problem (e.g., “title is required”, “price must be greater than 0”).
        // .map((element) => element.message) → Loops through each error detail and extracts just the human‑friendly message string.
        // .join(",") → Combines all those messages into one string, separated by commas.
        // so, Instead of sending back a bulky Joi error object, you can return a clean, readable error message to the client.
        let errorMsg = error.details.map((element) => element.message).join(",");
        throw new ExpressError(400, errorMsg);
    } else {
        next();   // If validation passes, next() lets Express continue to your route handler.
    }
}
// Now we need to pass this fn as middleware in the app.post() of review creation for server-side validation.



// Here we will create another middleware to perform the Authorization for reviews, so that only the author of the review can edit the review, so here we are checking whether the currently logged in user is the author of this review or not, if it is not the author of this review.
module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;

    let review = await Review.findById(reviewId);

    // So here we are actually setting the Authorization for editing this review, so that only the author of this review can delete this review, so here we are checking whether the currently logged in user is the author of this review or not, if it is not the owner of this review, then it will simply redirect back to show route of this listing without deleting this review in the database and also showing the error message using flash, otherwise if it is the author of this review, then it will delete this review in the database
    // Here this 'currentUser' is the locals variable which we have defined to store the value of req.user in it, so that we can easily access this currentUser variable in our ejs files without passing it in the render method of each route, so that we can easily access the details of currently logged in user in our ejs files using this currentUser variable.
    // Here currentUser._id actually refers to the _id of the currently logged in user & review.author refers to the _id of the author of the current review & this .equals() method is used to compare these two _id values
    if(!review.author._id.equals(res.locals.currentUser._id)){
        req.flash("error", "You are not the author of this review");

        return res.redirect(`/listings/${id}`);   // it will redirect back to Show Route actually now.
    }
    // Here we must need to use return because Even though res.redirect() sends a response, the function doesn’t automatically stop. The code continues to the next line, which tries to call res.render().
    // That means Express attempts to send two responses for the same request, which triggers the error: Error: Can't set headers after they are sent.

    next();
};