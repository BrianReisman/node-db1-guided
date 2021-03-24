const express = require('express')
const Post = require('./post-model')
// just an extension of the Error class, adding a statusCode property.
const ExpressError = require('../expressError.js');

const router = express.Router()

//----------------------------------------------------------------------------//
// note that Post.getById() should return an actual object, not an array of
// objects (be it an empty array, or an array with a single element). So if the
// id isn't found in the DB, we will get back null (not truthy);
// 
// also note that we are doing the async part here, not in the model. The model
// will return the promises that are returned by knex. 
//----------------------------------------------------------------------------//
async function checkId(req, res, next) {
  try {
    const post = await Post.getById(req.params.id);
    if (post) {
      req.post = post;
      next()
    } else {
      const err = new ExpressError('id not found', 404);
      next(err);
    }
  } catch (err) {
    next(new ExpressError(err, 500));
  }

}

//----------------------------------------------------------------------------//
// just validate that it's a json object. We have need to validate the body with
// all of the needed fields (title and content), or with just one of the fields
// (title or content), so we can't enforce needing them both here, or we will
// break something (like updating just the title of a post).
// 
// but it should contain at least one of them...
//----------------------------------------------------------------------------//
function checkPayload(req, res, next) {
  const newPost = req.body;
  if (!newPost.title && !newPost.contents) {
    const err = new ExpressError('body must include title, contents, or both', 400);
    next(err);
  } else {
    next()
  }
}

//----------------------------------------------------------------------------//
// get all posts
//----------------------------------------------------------------------------//
router.get('/', async (req, res, next) => {
  try {
    res.json(await Post.get());
  } catch (err) {
    next(new ExpressError(err, 500));
  }
})

//----------------------------------------------------------------------------//
// return a single record. Note that if we get to the middleware handler, it's
// because we got past the checkId validator, which puts the found record on the
// request object... so we just return that.
//----------------------------------------------------------------------------//
router.get('/:id', checkId, (req, res) => {
  res.status(200).json(req.post)
})

//----------------------------------------------------------------------------//
// there is a gap in our validation ... if someone passes an object to create
// with only a title, or only contents, we are allowing that. That's because we
// are allowing a body with only one field for the PUT handler, in case the
// developer wants to only update one field. Think through how we could validate
// this properly in each case - maybe we need two validators (one that checks
// for either field, one that checks for both.)
//----------------------------------------------------------------------------//
router.post('/', checkPayload, async (req, res, next) => {
  try {
    const data = await Post.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    next(new ExpressError(err, 500));
  }
})

//----------------------------------------------------------------------------//
// checkPayload validator ensures we have at least one needed field.
//----------------------------------------------------------------------------//
router.put('/:id', checkPayload, checkId, async (req, res, next) => {
  try {
    const data = await Post.update(req.params.id, req.body)
    res.json(data)
  } catch (err) {
    next(new ExpressError(err, 500));
  }
})

//----------------------------------------------------------------------------//
// the model could choose to return the id of the thing deleted, or the actual
// data of the thing deleted. 
// 
// a quick search reveals that the semantics for the HTTP DELETE request are
// such that you can return a 202, 204, or 200. Return a 202 if the request has
// been received, but not yet fulfilled (i.e. the item is being asynchronously
// deleted ... which means that if there is a problem deleting it, there is no
// way to return or capture an error, other than attempting a request for
// status.)
// 
// Returning a 204 should include no body. It simply means the request object is
// now deleted. 
// 
// Returning a 200 should include a "representation of the requested action" in
// the body ... i.e., a message saying something like "item #x is now deleted."
// 
// here, I chose to send back a 204 with no body. 
//----------------------------------------------------------------------------//
router.delete('/:id', checkId, async (req, res, next) => {
  try {
    await Post.remove(req.params.id);
    res.status(204).send("");
  } catch (err) {
    next(new ExpressError(err, 500));
  }
})

//----------------------------------------------------------------------------//
// error handler ... the status code should be in the .statusCode field.
// Otherwise, default to 500. We are returning the err.stack, but we might not
// want to do that. We could make that conditional on whether or not we are
// running in the production environment (designated by the value of the
// NODE_ENV environment variable... if it says "Production", don't return the
// stack, otherwise, do.)
//----------------------------------------------------------------------------//
router.use((err, req, res) => {
  err.statusCode = err.statusCode || 500;
  res.status(err.statusCode).json({ message: err.message, stack: err.stack })
})

module.exports = router
