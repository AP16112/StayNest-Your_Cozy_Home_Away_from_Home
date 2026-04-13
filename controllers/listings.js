// here this is the controller file for listings, so here we will write all the logic related to listings in this file, so that our route file will be clean and we will just call the functions which are present in this controller file in our route file, so that our route file will be clean and easy to read and also easy to maintain. 

const Listing = require("../models/listing.js");  // here we can also write like this, but generally we write like this only because it is a standard way to write it, so it is better to write like this only
// As we know that for this Model, by-default mongoose will create a collection called as 'listings' for this model

// Geocoding :-
// Geocoding is the process of converting addresses (like a street address) into geographic coordinates (like latitude and longitude), which you can use to place markers on a map, or position the map.

// We will make use of Mapbox Geocoding API for that. It is a service provided by Mapbox that allows you to convert addresses into geographic coordinates (latitude and longitude) and vice versa. The Mapbox Geocoding API is commonly used in web and mobile applications to enable location-based features, such as searching for places, displaying maps, and providing directions. By using the Mapbox Geocoding API, you can easily integrate geocoding functionality into your application and enhance the user experience with location-based services.
// Here we will use mapbox-sdk which is a JavaScript library that provides an interface to interact with Mapbox APIs, including the Geocoding API. It allows you to easily make requests to Mapbox services and handle the responses in your application. By using the mapbox-sdk, you can simplify the process of integrating Mapbox's geocoding functionality into your web application and enhance the user experience with location-based features. To use the mapbox-sdk, you need to install it using npm: npm install @mapbox/mapbox-sdk
// It is available as a npm package, so we need to install it using :- npm install @mapbox/mapbox-sdk
// ALl things related to this are present on github under the name of mapbox-sdk, so you can check that for more details and documentation. It is a JavaScript library that provides an interface to interact with Mapbox APIs, including the Geocoding API. It allows you to easily make requests to Mapbox services and handle the responses in your application. By using the mapbox-sdk, you can simplify the process of integrating Mapbox's geocoding functionality into your web application and enhance the user experience with location-based features. To use the mapbox-sdk, you need to install it using npm: npm install @mapbox/mapbox-sdk

// Now we will require this mapbox-sdk here to use the geocoding functionality of mapbox in our application, so that we can convert the location entered by the user in the form of address into geographic coordinates (latitude and longitude) and then we can store those coordinates in our database to show the location of that listing on the map in the show page of that listing.
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
// Here we are strating this geocoding service by passing the access token to it, so that we can use this geocoding service to convert the location entered by the user in the form of address into geographic coordinates (latitude and longitude) and then we can store those coordinates in our database to show the location of that listing on the map in the show page of that listing.
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


// so here this 'index' function is a asynchronous fn which is used to render all the listings present in the database on the index page of listings, so here we will write the logic to find all the listings from the database and then render those listings on the index page of listings here in this 'index' function here, so that we can call this 'index' function in our route file to render all the listings on the index page of listings.
module.exports.index = async (req, res) => {
    // To find all documents i.e listings here in the 'listings' collection, we can use an empty query object like this :-
    // Now here if we want we can use .then() & .catch() method to handle the promise returned by this .find() method of mongoose, but here we will use async-await way to handle this promise because it is more cleaner way to handle the asynchronous processes than using .then() & .catch() method, so we will use async-await way to handle this promise here.
    // So as we know that this .find() method of mongoose is asynchronous, so it will return a promise, so we will handle this promise using async-await way here.
    // So here we will use this way to handle this promise using async-await way :-
    // As this arrow function is not an async function, so we will make this arrow function as an async function by using this 'async' keyword before this arrow function like this :- app.get("/listings", async (req, res) => { ... })
    let allListings = await Listing.find({});
    
    console.log(allListings);

    // here we need to use this i.e 'listings/index.ejs' because here index.ejs is present inside the listings folder which present inside views folder and we only set the path till views folder only
    res.render("listings/index.ejs", { allListings });
};


// So here this 'renderNewForm' function is used to render the form for creating new listing, so here we will write the logic to render the form for creating new listing here in this 'renderNewForm' function here, so that we can call this 'renderNewForm' function in our route file to render the form for creating new listing.
module.exports.renderNewForm = (req, res) => {
    // here we need to use this i.e 'listings/new.ejs' because here new.ejs is present inside the listings folder which present inside views folder and we only set the path till views folder only
    res.render("listings/new.ejs");
}

// So here this 'showListing' function is used to render the show page of a listing, so here we will write the logic to find the listing based on the id from the database and then render that listing on the show page of that listing here in this 'showListing' function here, so that we can call this 'showListing' function in our route file to render the show page of that listing.
module.exports.showListing = async (req, res) => {
    let {id} = req.params;

    // Now we will search this listing based on this id in the database
    // As we know that this .findById() method of mongoose is asynchronous, so it will return a promise, so we will handle this promise using async-await way here
    // So we also need to use async keyword before this arrow function to make this arrow function as an async function, so that we can use await keyword inside this arrow function to handle this promise using async-await way, so here we will use async keyword before this arrow function like this :- app.get("/listings/:id", async (req, res) => { ... })
    let listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    // Here we are using nexted populate to populate the author of each review also, so that we can easily access the username of author of each review in show.ejs file using this listing.reviews[i].author.username, so here we will use this nested populate like this :- .populate({ path: "reviews", populate: { path: "author" } })
    // Here path: "reviews" means that we want to populate the reviews field of this listing document and inside that populate: { path: "author" } means that we want to populate the author field of each review document which is present inside this reviews array of this listing document, so that we can easily access the username of author of each review in show.ejs file using this listing.reviews[i].author.username, so here we will use this nested populate like this :- .populate({ path: "reviews", populate: { path: "author" } })
    // Here we are also populating the owner of this listing, so that we can easily access the username of owner of this listing in show.ejs file using this listing.owner.username, so here we will use this populate like this :- .populate("owner")
    // Here this "reviews" is the field name which we write inside Listing schema to store the reference to reviews documents.
    // Now Populated paths are no longer set to their original _id , their value is replaced with the mongoose document returned from the database by performing a separate query before returning the results.
    // So now it will print the whole order document object for this "reviews" filed inside this Listing document actually
    // In MongoDB, when you use references (ObjectId + ref), the parent document only stores the IDs of related documents.
    // .populate() tells Mongoose:- “Go fetch the actual documents from the referenced collection and replace those IDs with the full data.”

    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }else {

        console.log(listing);

        // here we need to use this i.e 'listings/show.ejs' because here show.ejs is present inside the listings folder which present inside views folder and we only set the path till views folder only
        res.render("listings/show.ejs", { listing });
    }
};



// So here this 'createListing' function is used to create a new listing and then add that new listing to the database, so here we will write the logic to create a new listing and then add that new listing to the database here in this 'createListing' function here, so that we can call this 'createListing' function in our route file to create a new listing and then add that new listing to the database.
module.exports.createListing = async (req, res, next) => {
    // try {

        // Here you’re asking Joi to check the incoming request body against your schema rules.
        // Return value → Joi returns an object with two keys:
        // error → Contains details if validation fails (e.g., missing field, wrong type).
        // value → The validated (and possibly sanitized) data.
        // let result = listingSchema.validate(req.body);
        // // console.log(result);
        // if(result.error){    // so if error exists in this result
        //     throw new ExpressError(400, result.error);
        // }

        // Here this is the basic code for forward geocoding using mapbox geocoding API, so here we will write the code to convert the location entered by the user in the form of address into geographic coordinates (latitude and longitude) using mapbox geocoding API here in this 'createListing' function here, so that we can store those coordinates in our database to show the location of that listing on the map in the show page of that listing.
        let response = await geocodingClient.forwardGeocode({
            query: req.body.listing.location,
            limit: 1     // here we are setting the limit to 1 because we only want one result for this location query, so that we can easily access the coordinates of that location from this response object, so here we will set the limit to 1 like this :- limit: 1
            // So it will only return one location coordinates for this location query, so that we can easily access the coordinates of that location from this response object, so here we will set the limit to 1 like this :- limit: 1
        }).send();


        let url = req.file.path;   // here this req.file.path contains the path of the uploaded file which is stored in cloudinary using multer-storage-cloudinary package, so we can easily access the URL of that image using this req.file.path and then we can store this URL in our database to access that image whenever we want to access it in future.
        let filename = req.file.filename;   // here this req.file.filename contains the filename of the uploaded file which is stored in cloudinary using multer-storage-cloudinary package, so we can easily access the filename of that image using this req.file.filename and then we can store this filename in our database to access that image whenever we want to access it in future.


        //as we know that for POST requests, all data is present inside the body only
        // Now this is one way to extract these values from req object, but it is valid when the values present inside req.body also have these names only i.e when we gave them these names only in HTML file
        // let { title, description, image, price, country, location } = req.body;  // here we are using destructuring assignment to extract these values from the req.body object
        // We know that data comes from POST request can't be accessed directly, so we need to parse it using this express.urlencoded() middleware, so after parsing it, we can easily access the data from req.body object
        //------------------OR-------------------
        // More better way is to gave the names to these values like listing[key] & then we can easily extract them here
        let listing = req.body.listing;    // here in this 'req.body.listing' , this listing is actually a object
    
        // Here now no need of this also, as this can also get checked using this listingSchema above
        // if(!listing) {   // it means that if the body of req, don't have any lisiing
        //     // statusCode = 400 means bad request.
        //     throw new ExpressError(400, "Send valid data for listing");
        // }
        // Here we are currently checking whether the listing is available or not but not checking its individual fields.
        // Here if out of all fields of this listing some are present, that it will not throw this above error as it is not empty or undefined, but we want in that case also, we must check whether all fields are defined or not
        // So we will make use of 'Validation for Schema' for doing that.


        // here now this 'listing' is actually a jS object now
        // console.log(listing);

        // Creating the newListing object i.e new document to add into the collection
        const newListing = new Listing(listing);

        // SO one way to check for individual fields is like this :-
        // But this is not the very good way.
        // if(!newListing.description) {
        //     throw new ExpressError(400, "Description is missing");
        // }

        // if(!newListing.title) {
        //     throw new ExpressError(400, "Title is missing");
        // }

        // if(!newListing.location) {
        //     throw new ExpressError(400, "Location is missing");
        // }
        // SO to do all this in simple way, we make use of a toole called as 'JoI'
        // Joi is a powerful JavaScript library used for schema-based validation of data, especially in Node.js applications. It lets you define rules for objects, strings, numbers, arrays, etc., and ensures incoming data matches those rules before being processed.
        // Toi was Originally part of the hapi.js framework, now a standalone package.
        // Purpose: Provides a declarative way to validate data structures.
        // Use Case: Commonly used in Express apps to validate request bodies (e.g., form submissions, API payloads).

        // But to use this, we firstly need to install it as it is a npm package only using :- npm install joi
        // And then we need to require it firstly to use it.

        // console.log(req.user);
        // Here this req.user contains this '_id' of currently logged in user, so we can easily set the owner of this listing to the currently logged in user by using this req.user._id here.
        newListing.owner = req.user._id;

        newListing.image = {url, filename};   // here we are setting the image field of this newListing document to this object which contains the url and filename of the uploaded image which is stored in cloudinary using multer-storage-cloudinary package, so that we can easily access the URL and filename of that image using this newListing.image.url and newListing.image.filename respectively and then we can use this URL to access that image whenever we want to access it in future.

        // Here we are setting the geometry field of this newListing document to this geometry object which we get from the response of this geocodingClient.forwardGeocode() method, so that we can easily access the coordinates of the location entered by the user in the form of address using this newListing.geometry.coordinates and then we can use these coordinates to show the location of that listing on the map in the show page of that listing.
        // here this response.body.features[0].geometry is actually the GeoJSON format data only.
        newListing.geometry = response.body.features[0].geometry;

        //Now to add this newListing to database, we need to save it using .save() method
        // As we know that this .save() method is asynchronous, so it will return a promise, so we will handle this promise using .then() & .catch() method here 
        // And if we are using .then() & .catch() method to handle this promise, then we don't need to use async-await way to handle this promise because we can use any one of these two ways to handle this promise, so here we will use .then() & .catch() method to handle this promise here.
        let savedListing = await newListing.save();

        console.log(savedListing);

        // "success" is key & "New Listing Created!" is actually the value for key
        req.flash("success", "New Listing Created!");

        res.redirect("/listings");
    // }catch(err) {
    //     next(err);
    // }
};


// So here this 'renderEditForm' function is used to render the form for editing a listing, so here we will write the logic to find the listing based on the id from the database and then render that listing on the form for editing a listing here in this 'renderEditForm' function here, so that we can call this 'renderEditForm' function in our route file to render the form for editing a listing.
module.exports.renderEditForm = async (req, res) => {
    let {id} = req.params;

    // Now we will search this listing based on this id in the database
    // As we know that this .findById() method of mongoose is asynchronous, so it will return a promise, so we will handle this promise using async-await way here
    // So we also need to use async keyword before this arrow function to make this arrow function as an async function, so that we can use await keyword inside this arrow function to handle this promise using async-await way, so here we will use async keyword before this arrow function like this :- app.get("/listings/:id/edit", async (req, res) => { ... })
    let listing = await Listing.findById(id);

    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }else {
        let originalImageUrl = listing.image.url;
        // Here we are using the transformation feature of cloudinary to transform this original image URL to this new image URL which will give us the blurred version of that original image, so that user can preview the original image in blurred version while editing that listing, so that user can easily identify that this is the original image of that listing and then if user want, he can change this original image with some new image by uploading some new image, so that we can update the image of that listing with that new uploaded image in the database.
        originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250,e_blur:50");

        // here we need to use this i.e 'listings/show.ejs' because here show.ejs is present inside the listings folder which present inside views folder and we only set the path till views folder only
        res.render("listings/edit.ejs", {listing, originalImageUrl});
    }
};


// So here this 'updateListing' function is used to update a listing, so here we will write the logic to find the listing based on the id from the database and then update that listing with this new listing value in the database here in this 'updateListing' function here, so that we can call this 'updateListing' function in our route file to update a listing.
module.exports.updateListing = async (req, res) => {
    let {id} = req.params;    // it will return the id which is present inside the path i.e /listings/:id

    let listing = req.body.listing;    // here in this 'req.body.listing' , this listing is actually a object

    // Here now we don't need this as this will be done by this 'validateListing' middleware now.
    // if(!listing) {   // it means that if the body of req, don't have any lisiing
    //     // statusCode = 400 means bad request.
    //     throw new ExpressError(400, "Send valid data for listing");
    // }

    // Now we will firstly search this listing in database based on id & then we will update that listing or docs
    // As this .findByIdAndUpdate() method of mongoose is asynchronous, so it will return a promise, so we will handle this promise using async-await way here
    // So we also need to use async keyword before this arrow function to make this arrow function as an async function, so that we can use await keyword inside this arrow function to handle this promise using async-await way, so here we will use async keyword before this arrow function like this :- app.put("/listings/:id", async (req, res) => { ... })
    let updatedListing = await Listing.findByIdAndUpdate(
        id,
        {...listing},   // here this ... i.e {...listing}) is JavaScript’s object spread operator.
        //It copies all properties from the object listing into a new object.It’s a shorthand way to clone or merge objects.

        // it is used to run the validators which we have defined in our schema, so it will check the validation of this listing value with the validation which we have defined in our schema, so if this listing value is valid as per the validation which we have defined in our schema, then it will update this listing  with this new listing value in the database, otherwise if this new listing value is not valid as per the validation which we have defined in our schema, then it will simply ignore this update operation and it won't update this listing  with this new listing value in the database
        {runValidators: true, new: true}   // it is used to return the updated document after updating this listing document in the database, so it will return the updated listing document after updating this listing document in the database, otherwise if we don't use this new: true option, then it will return the old listing document before updating this listing document in the database, so it is necessary to use this new: true option here to return the updated listing document after updating this listing document in the database
    );

    // Only update image if a new file was uploaded
    if(typeof req.file  !== "undefined"){
        let url = req.file.path;   // here this req.file.path contains the path of the uploaded file which is stored in cloudinary using multer-storage-cloudinary package, so we can easily access the URL of that image using this req.file.path and then we can store this URL in our database to access that image whenever we want to access it in future.
        let filename = req.file.filename;   // here this req.file.filename contains the filename of the uploaded file which is stored in cloudinary using multer-storage-cloudinary package, so we can easily access the filename of that image using this req.file.filename and then we can store this filename in our database to access that image whenever we want to access it in future.

        updatedListing.image = {url, filename};   // here we are setting the image field of this updatedListing document to this object which contains the url and filename of the uploaded image which is stored in cloudinary using multer-storage-cloudinary package, so that we can easily access the URL and filename of that image using this updatedListing.image.url and updatedListing.image.filename respectively and then we can use this URL to access that image whenever we want to access it in future.

        await updatedListing.save();
    }

    req.flash("success", "Listing Updated!");

    // console.log(updatedListing);
    // res.redirect("/listings");
    res.redirect(`/listings/${id}`);   // it will redirect back to Show Route actually now.
};


// So here this 'destroyListing' function is used to delete a listing, so here we will write the logic to find the listing based on the id from the database and then delete that listing document from the database here in this 'destroyListing' function here, so that we can call this 'destroyListing' function in our route file to delete a listing.
module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;

    // So now we will firstly find the listing document having this id in the database and then we will delete that listing document from the database
    // As this .findByIdAndDelete() method of mongoose is asynchronous, so it will return a promise, so we will handle this promise using async-await way here
    // So we also need to use async keyword before this arrow function to make this arrow function as an async function, so that we can use await keyword inside this arrow function to handle this promise using async-await way, so here we will use async keyword before this arrow function like this :- app.delete("/listings/:id", async (req, res) => { ... })
    let deletedListing = await Listing.findByIdAndDelete(id);
    // here whenever this gets executed, after this, post middleware which we write in 'listing.js' file will also gets executed 
    // because we get the post middleware for 'findOneAndDelete' i.e for 'findByIdAndDelete' fn for listingSchema

    console.log(deletedListing);

    req.flash("success", "Listing Deleted!");

    res.redirect("/listings");
};