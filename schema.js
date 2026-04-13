// Here we will use this file for performing Server-side validation by creating the Joi schema using Joi.
 
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


// So we will firstly require this 'joi' here
const Joi = require("joi");

// Joi Schema :-
// Now we will write that schema here which we need to validate actually i.e listing schema here

module.exports.listingSchema = Joi.object({
    // It means that this key i.e 'listing' itself must be an object and it must contains all these things. It cannot be missing or null — it’s required.
    listing : Joi.object({
        // It means that this 'listing' object must conatins title & type of title must be string & it must be required.
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),    // so price can't be -ve number
        // SO here this image doesn't needs to be required 
        // .allow("", null) → By default, Joi would reject empty strings or null values. But this tells Joi: “It’s okay if image is either an empty string ("") or null.”
        image: Joi.string().allow("", null) ,
    }).required()
});


// Here this way is not prefer because in future we can have more than one schema,but this way is prefer when we want to export only one schema as the whole object
// module.exports = listingSchema;
//----------OR----------
// SO here we will use this way, because in future if we want to export another schema, we can also do that like this only.
// module.exports.listingSchema = Joi.object({
//     // It means that this key i.e 'listing' itself must be an object and it must contains all these things. It cannot be missing or null — it’s required.
//     listing : Joi.object({
//         // It means that this 'listing' object must conatins title & type of title must be string & it must be required.
//         title: Joi.string().required(),
//         description: Joi.string().required(),
//         location: Joi.string().required(),
//         country: Joi.string().required(),
//         price: Joi.number().required().min(0),    // so price can't be -ve number
//         // SO here this image doesn't needs to be required 
//         // .allow("", null) → By default, Joi would reject empty strings or null values. But this tells Joi: “It’s okay if image is either an empty string ("") or null.”
//         image: Joi.string().allow("", null) ,
//     }).required()
// });
// SO here we will use this way, because in future if we want to export another schema, we can also do that like this only.
//  module.exports.anotherSchema = Joi.object({

// });

// So now actually only one object will be exported which contains all these schemas, & during requiring, we can make use of object destructuring to excess all these schemas



// Now we will write that schema here which we need to validate the reviews schema here
// So here it is used to perform server-side validation for reviews model.
module.exports.reviewSchema = Joi.object({
    // It means that this key i.e 'review' itself must be an object and it must contains all these things. It cannot be missing or null — it’s required.
    review : Joi.object({
        // It means that this 'review' object must conatins rating & type of rating must be number & it must be required.
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required()
});