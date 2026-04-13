// In this models folders, we will create different models that we will need in this project
// Different models means different collections in our database.

// Here this is the model for 'review' 
// Here we will firstly create the schema for the review model i.e for this 'review' collection
// In Mongoose, creating new models means creating new collections.

// Creating the Model :-

const mongoose = require("mongoose");

// Here no need to create the connection again, as here we are only creating the model, but we will use that model in app.js file only
// SO we will require this current model directly in app.js

const Schema = mongoose.Schema;  // here we are creating a shortname for this mongoose.schema

const reviewSchema = new Schema({
    comment: String,
    rating: {
        type: Number,
        min: 1,    // so we are seting the condition that the min rating can't be < 1
        max: 5      // so we are seting the condition that the max rating can't be > 5
    },
    createdAt: {
        type: Date,    
        // default: Date.now()      // not the correct way
        default: Date.now,      // correct way
        // Date.now() → Executes immediately when the schema is defined, so all documents would get the same timestamp (the time the app started).
        // Date.now (without parentheses) → Passes the function reference, so Mongoose calls it each time a new document is created.
        // So, This is the correct way to ensure each document gets its own creation time.
    },
    author: {
        // Now this author must refer to User model because any author firstly must exists in database
        type: Schema.Types.ObjectId,
        ref: "User"
        // So here we are storing the id of the user document in the author field of review document, so that we can easily access the details of author of that review by using this wuthor field because this author field is actually the reference to the user document which is the author of that review.
    }
});


// Now we will create the review model here
// So by-default mongoose will create a collection called as 'reviews' for this model
const Review = mongoose.model("Review", reviewSchema);


// Now we will export this Review model, so that we can use it inside app.js file by requiring it.
module.exports = Review; 
// Now we can require this model in app.js file using :- const Review = require("./models/review");


// Now here we know that each listing can have multiple reviews like 100 or 500 something
// SO here listings collection  is forming one to many relation with reviews collections here
// And as 1 listings will not have crores of reviews, so we will use array of reference of reviews in listing nodel schema here
// so we will store array of reviews documents id in the listing model schema here to set a relation b/w them.


// Now we can create a form to take the review for each listings & we can create that form inside 'show.ejs' file as then it became easier to know that the review created is for what listing.
