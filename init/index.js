// Here we will use this 'init' folder to do all the initialization work like database initialization & all.
// So this 'init' folder contains files used to initialize the database at first
// Because whenever we are creating a new website, we need to initialize the database first, so that we can perform all the operations on that database in future 

// So we will write all the code related to database connection in this file of this 'init' folder, so that we can easily initialize the database whenever we want to do that by simply running these files of 'init' folder, so it is a good practice to write all the code related to database connection in a separate file only, so that we can easily manage our code and it will be easy to understand also.

// ANd we will only run this file once to initialize the database, so after that we will not run this file again and again.

// Now firstly, we need to reqire the mongoose here
// And we also need the Listing model, so we will also require the listing.js file here
const mongoose = require("mongoose");
const Listing = require("../models/listing.js"); 
// . → refers to the current directory (where the file is located).
// .. → refers to the parent directory (one level up).
// Here current directory is 'init', but models is present in its parent directory, that's why we use .. here
// As we know that for this Model, by-default mongoose will create a collection called as 'listings' for this model

// Now we will also require the data.js from this 'init' folder only
// Here as both this 'index.js' & 'data.js' file are present in same folder, so we are using ./data.js only here
const initData = require("./data.js");


// We also need to set the database connection here
// Here this MONGO_URL is the URL of our MongoDB database, which is running locally on our machine.
const MONGO_URL = "mongodb://127.0.0.1:27017/staynest";

// Here this .connect() fn of mongoose is used to connect to mongoDB server
// It will Connects to a local MongoDB server
// Uses database name: staynest
// 127.0.0.1 is the loopback IP (same as localhost)
// Uses default MongoDB port 27017 (which is a fixed port number)
// mongoose.connect('mongodb://127.0.0.1:27017/staynest');
// Here 'staynest' is the database of mongoDB to which we are connecting

// Here As soon as we run this 'mongoose.connect('mongodb://127.0.0.1:27017/staynest');' command, it will actually awaits for a promise from the database itself.
// Here this .connect() method is a asynchronous method, so it will start a asynchronous process
// So most of the proccess that we will perform using mongoose will actually be asynchronous processes because sometimes it takes time to gets the response from the database, so it is necessary for these processes to be asynchronous
// SO we will handle all these functions asynchronously only.
// SO that's why we will use this way :-
// As we know that An async function always returns a Promise, here also it will return a promise
// What is happening here? :-
// mongoose.connect() is asynchronous. So, it returns a Promise
// await:
// pauses execution inside main()
// waits until MongoDB connection is done
// If connection succeeds → move on & print 'connected to DB successfully'
// If connection fails → throw an error

main().then(() => {
    console.log("connected to DB successfully");
})
.catch((error) => {
    console.log(error);
});

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/staynest');
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/staynest');` if your database has auth enabled
}


// Now we will create this asynchronous function called 'initDB' which is used to initilaize this collection of our database
// But firstly we will empty our collection if any data is already present in that
const initDB = async () => {
    // Here as we know that .deleteMany() is asynchronous, so we need to handle it using async-await keyword here
    await Listing.deleteMany({});  // it will firstly delete all the documents present inside this 'listings' collection (this listings collection actually gets created by default by mongoose as model name is 'Listing')

    //Here this .map() method is used to iterate over each object of this initData.data array and for each object, we are adding a new property called 'owner' in it and we are assigning the value of "69d8f4afb4aae7f6b59261fc" to that owner property of each object of this initData.data array, so that we can easily set the owner of each listing document which we are going to create in our database using this initData.data array.
    // Here ...obj is used to copy all the existing properties of that object in the new object which we are creating here and then we are adding a new property called 'owner' in that new object and assigning the value of "69d8f4afb4aae7f6b59261fc" to that owner property of that new object, so that we can easily set the owner of each listing document which we are going to create in our database using this initData.data array.
    // But this map() actually returns a new array of objects with the new owner property in it, so we are assigning that new array of objects to this initData.data variable again, so that we can use this initData.data variable to create the listing documents in our database with the owner property in it.
    initData.data = initData.data.map((obj) => ({ ...obj, owner: "69d8f4afb4aae7f6b59261fc" }));
    // SO here for each listings, we are adding the owner property actually

    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};


initDB();


// Now to run this file only once, we will simply run this file using this command :- node index.js  ->  inside this 'init' directory
// so if in any case, our database gets deleted or we want to initialize the database again, then we can simply run this file again.