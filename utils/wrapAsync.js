// Here we will create this folder called as 'utils' which is used to store utility things i.e extra things like error class, wrapAsync fn, etc.

// Using WrapAsync :-  It is used to handle async errors actually in Express v4
// Using try-catch to handle handle error makes our code very bulky
// SO more better way is to use wrapAsync.
// SO we will create a function called as wrapAsync to wrap our async functions
// And this wrapAsync fn will be a unique fn which takes some fn as input & also return another function
// So this is higher-order function that wraps our async route handlers.

// wrapAsync takes an async function (fn) as input. It returns a new function that actually calls this argument fn(req, res, next).
// If fn throws or rejects, .catch(next) forwards the error to Express’s error-handling middleware.
// This way, you don’t need to write try/catch in every route
// In Express v5 which we are using, you technically don’t need wrapAsync because async errors are caught automatically.
// But many developers still use it for consistency and backward compatibility.

// Express v4: wrapAsync is very useful.
// Express v5: you can just throw, but wrapAsync still works fine if you want consistent code style.

// Here fn is expected to be an async route handler.
// wrapAsync returns a new function that Express can use as a route handler.
// Inside the returned function, it calls fn(req, res, next).
// Since fn is async, it returns a Promise. So .catch((err) => next(err)) ensures that if the Promise rejects (because of a thrown error or failed await), the error is passed to Express’s error-handling middleware via next(err).

// But in In Express v5, you don’t need wrapAsync because async errors are caught automatically.
function wrapAsync(fn) {
    return function(req, res, next) {
        fn(req, res, next).catch(next);
    }
}

//.catch(next) :- If the Promise rejects (because of an error inside fn), .catch(next) forwards the error to Express’s error-handling middleware.
// This avoids having to write try/catch in every route.
// So now whenever we call this wrapAsync fn now, this will actually execute or call this async fn function which we passes as argument in wrapAsync fn.

// here we are exporting this fn
module.exports = wrapAsync;

//--------------------OR-----------------
// module.exports = (fn) => {
//     return function(req, res, next) {
//         fn(req, res, next).catch(next);
//     }
// }