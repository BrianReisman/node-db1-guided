//----------------------------------------------------------------------------//
// This class extends the Error class, allowing for a statusCode property, which
// defaults to 500. 
// 
// The "message" parm could be a string, or an instance of Error (in which case
// the message, name, and stack are copied.)
// 
// Use like this:
// 
//      next(new ExpressError('id not found', 404));
// 
// or like this: 
// 
//      try {
//        // do something
//      } catch (err) {
//        next(new ExpressError(err, 500));
//      }
//----------------------------------------------------------------------------//
class ExpressError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode || 500;
    }
}

module.exports = ExpressError;