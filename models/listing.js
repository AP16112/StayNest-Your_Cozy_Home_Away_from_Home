// In this models folders, we will create different models that we will need in this project
// Different models means different collections in our database.
// Here this is the model for 'listing'
// Here we will firstly create the schema for the listing model i.e for this 'listing' collection
// In Mongoose, creating new models means creating new collections.

// Creating the Model :-

const mongoose = require("mongoose");

const Review = require("./review");

const listingCategories = [
    "trending",
    "rooms",
    "iconic-cities",
    "mountains",
    "castles",
    "amazing-pools",
    "camping",
    "farms",
    "arctic",
    "domes",
    "boats",
];

// Here no need to create the connection again, as here we are only creating the model, but we will use that model in index.js file only
// SO we will require this current model directly in app.js

const Schema = mongoose.Schema;  // here we are creating a shortname for this mongoose.schems

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        url: String,
        filename: String,   // here we are storing the filename of the image which is stored in cloudinary
    },
    price: Number,
    location: String,
    country: String,
    category: {
        type: String,
        enum: listingCategories,
        required: true,
    },
    reviews: [
        {
            // This tells Mongoose that the field will store a MongoDB ObjectId.
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],

    // Each listing will only have 1 owner & not array of owners
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

    // Here we are storing the GeoJSON data in this geometry field.
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
});

// Here we are creating the post mongoose middleware
// So here we want to delete all the reviews also whenever we delete any listing
listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing && listing.reviews.length){
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

// Now we will create the listing model here
// So by-default mongoose will create a collection called as 'listings' for this model
const Listing = mongoose.model("Listing", listingSchema);

// Now we will export this Listing model, so that we can use it inside app.js file by requiring it.
module.exports = Listing;
module.exports.listingCategories = listingCategories;
