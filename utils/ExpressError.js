// Here we will create our own custom Error class

// So here this 'ExpressError' is a custom error class that we are creating here 
// So here it will extends the default error class of Express here

class ExpressError extends Error {
    constructor(statusCode, message) {    //constructor for this class
        super();    // calling the constructor of default Error class
        this.statusCode = statusCode;
        this.message = message;
    }
}


// Here we are exporting this class, so that we can use it easily in some other js file.
module.exports = ExpressError;