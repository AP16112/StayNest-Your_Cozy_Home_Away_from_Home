// here this is the controller file for reviews, so here we will write all the logic related to reviews in this file, so that our route file will be clean and we will just call the functions which are present in this controller file in our route file, so that our route file will be clean and easy to read and also easy to maintain. 

// In Mongoose, creating new models means creating new collections.
// Now we can require the 'Listing' model in app.js file using :- const Listing = require("../models/listing");
// const Listing = require("../models/listing");
const Listing = require("../models/listing.js");  // here we can also write like this, but generally we write like this only because it is a standard way to write it, so it is better to write like this only
// As we know that for this Model, by-default mongoose will create a collection called as 'listings' for this model

const Review = require("../models/review.js"); 
// As we know that for this Model, by-default mongoose will create a collection called as 'reviews' for this model


// So here this 'createReview' function is used to create a new review for a listing, so here we will write the logic to create a new review for a listing in this 'createReview' function here, so that we can call this 'createReview' function in our route file to create a new review for a listing.
module.exports.createReview = async(req, res) => {
    // let { id } = req.params;   // it will give us the id of the listing
    //---------OR-----------
    let id = req.params.id;

    // console.log(id);

    let listing = await Listing.findById(id);   // it will give us the listing for which this review is created

    
    // This is used to access the complete review object as then we can easily extract the key-value pairs from that
    let review = req.body.review;    // here in this 'req.body.review' , this review is actually a object
    
    // Creating the newReview object i.e new document to add into the collection
    const newReview = new Review(review);

    newReview.author = req.user._id;

    // Now we are storing the reference of this newReview in its listing
    // The 'reviews' field in reviewSchema is defined as an array of ObjectIds referencing the Order model.
    // When you do .push(newReview), Mongoose automatically takes the _id of newReview and stores it in the orders array of the customer.
    // So you’re not embedding the whole newReview document — you’re just storing its ObjectId reference.
    listing.reviews.push(newReview);

    // here we firstly need to save newReview as during the already existing listing updation we need to reference to that newReview actually, so that needs to be already newReview.
    await newReview.save();
    // Now as we updated this current listing, so to save that change, we need to save it also.
    await listing.save();

    req.flash("success", "New Review Created!");

    // res.redirect(`/listings/${listing._id}`);
    res.redirect(`/listings/${id}`);
};


// So here this 'destroyReview' function is used to delete a review, so here we will write the logic to find the review based on the reviewId from the database and then delete that review from the database here in this 'destroyReview' function here, so that we can call this 'destroyReview' function in our route file to delete a review.
module.exports.destroyReview = async (req, res) => {
    let {id, reviewId} = req.params;

    // $pull: { reviews: reviewId } :- $pull tells MongoDB: “Go into the 'reviews' array field and remove any element equal to 'reviewId'.”
    // If reviews is an array of ObjectIds referencing review documents, this removes that specific review ID.
    // So, now The listing document’s reviews array no longer contains that review ID.
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});

    // Now we already removed the reference of this review from its listing, so we can simply remove this review from reviews collections now.
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review Deleted!");

    res.redirect(`/listings/${id}`);
};