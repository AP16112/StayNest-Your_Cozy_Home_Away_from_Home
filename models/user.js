// In this models folders, we will create different models that we will need in this project
// Different models means different collections in our database.
// Here this is the model for 'listing' 
// Here we will firstly create the schema for the listing model i.e for this 'listing' collection
// In Mongoose, creating new models means creating new collections.

// User Model :-
// user: username, password, email

// We can also define our own User however we like.
// Passport-local mongoose will add a username, hash and salt field to store the username, the hashed password and the salt value.

// Additionally, Passport-local mongoose adds some methods to our Schema.

// Creating the Model :-
const mongoose = require("mongoose");

// Here no need to create the connection again, as here we are only creating the model, but we will use that model in app.js file only
// SO we will require this current model directly in app.js
const Schema = mongoose.Schema;  // here we are creating a shortname for this mongoose.schema

const passportLocalMongoose = require("passport-local-mongoose").default;

// passport-local-mongoose :-
// A Mongoose plugin that simplifies using passport-local with MongoDB.
// Passport-Local Mongoose is a Mongoose plugin that simplifies building username and password login with Passport.
// Automatically adds fields like username, hash, and salt to your Mongoose schema.
// Provides helper methods like:
// User.register() → to create a new user with hashed password.
// User.authenticate() → to verify login credentials.
// User.serializeUser() / User.deserializeUser() → for session handling.

// You're free to define your User schema how you like. Passport-Local Mongoose bydefault will add a username, hash and salt field to store the username, the hashed password and the salt value.
// passport-local-mongoose automatically will add the username & password in the hashed form, so no need to write those in schema here.

const userSchema = new Schema({
    email: {
        type: String,
        required: true,    
    },
});


// Currently, our schema only has an email field, but when you call userSchema.plugin(passportLocalMongoose), the plugin automatically adds fields like username, hash, and salt for handling authentication. By default, it expects a username field, but you can configure it to use email instead.
userSchema.plugin(passportLocalMongoose);




// Now we will create the user model here
// So by-default mongoose will create a collection called as 'users' for this model
const User = mongoose.model("User", userSchema);


// Now we will export this User model, so that we can use it inside app.js file by requiring it.
module.exports = User; 


// Configuring Strategy :- i.e how can we apply some basic settings 

// passport.initialize() :-  
// A middleware that initializes passport
// passport.session() :- 
// A web application needs the ability to identify users as they browse from page to page.
// This series of requests and responses, each associated with the same user, is known as a session.
// passport.use(new LocalStrategy( User.authenticate() ))

// So internally, pbkdf2 hashing algorithm is used in passport.