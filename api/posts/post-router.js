const express = require('express')
// Looking for where knexfile.js is used? Follow this "require"...
const Post = require('./post-model.js')

const router = express.Router()

//----------------------------------------------------------------------------//
//----------------------------------------------------------------------------//
// 
//----------------------------------------------------------------------------//
router.get('/', async (req, res, next) => {
  try {
    const data = await Post.get()
    res.status(200).json(data)
  } catch (err) {
    next(err)
  }
})

//----------------------------------------------------------------------------//
//----------------------------------------------------------------------------//
// 
//----------------------------------------------------------------------------//
router.get('/:id', checkId, async (req, res, next) => {
  try {
    res.status(200).json(req.post);
  } catch (err) {
    next(err)
  }
})

//----------------------------------------------------------------------------//
//----------------------------------------------------------------------------//
// 
//----------------------------------------------------------------------------//
router.post('/', checkPayload, async (req, res, next) => {
  const body = req.body;
  try {
    const data = await Post.create(body);
    res.json(data)
  } catch (err) {
    next(err)
  }
})

//----------------------------------------------------------------------------//
//----------------------------------------------------------------------------//
// 
//----------------------------------------------------------------------------//
router.put('/:id', checkId, checkPayload, async (req, res, next) => {
  const { id } = req.params;
  const changes = req.body;
  try {
    const data = await Post.update(id, changes)
    res.json({ count: data });
  } catch (err) {
    next(err)
  }
})

//----------------------------------------------------------------------------//
//----------------------------------------------------------------------------//
// 
//----------------------------------------------------------------------------//
router.delete('/:id', checkId, async (req, res, next) => {
  const { id } = req.params;
  try {
    const data = await Post.remove(id)
    res.json({ count: data });
  } catch (err) {
    next(err)
  }
})


//============================================================================//
// MIDDLEWARE FUNCTIONS
//============================================================================//

//----------------------------------------------------------------------------//
// Error handling middleware
//----------------------------------------------------------------------------//
// This handler takes 4 parameters, which classifies it as "error handling
// middleware". Any call to "next()" that includes a value as a parameter (i.e.
// next(err) or next('error message') or next(0)) will be handled by this
// method. 
// 
// The idea is that you should call next() with an instance of Error(), to which
// has been added a .message property, and a .statusCode property. 
// 
// .statusCode indicates the result code the error handler should use in
// returning the result, and .message is part of the json body that is returned.
// 
//----------------------------------------------------------------------------//
router.use((err, req, res, next) => {
  err.statusCode = err.statusCode ? err.statusCode : 500;
  res.status(err.statusCode).json({ message: err.message, stack: err.stack })
})

//----------------------------------------------------------------------------//
// checkId middleware
//----------------------------------------------------------------------------//
// This middleware is used to determine if the ID is valid in a middleware
// handler that requires an ID. You would use this as part of the "local
// middleware stack" for a METHOD/path combination (i.e. PUT /:id) where the
// path includes an "id" parameter. 
// 
// This method uses Knex to look up the record, and if it is found, it adds the
// record to the request object, so the next handler in the chain can have
// access to it without having to look it up again. 
// 
// The .getById() function will return an object if the ID is found in the
// database, and it will return null/unassigned if it is not. If it's not found,
// we return a 404 using next(err) as shown below. 
// 
// If there is an exception in the call to Knex, or if the Knex-returned promise
// rejects, we will end up in the catch{} block, and thus will pass a 500 level
// error to the error handling middleware.
//----------------------------------------------------------------------------//
async function checkId(req, res, next) {
  const { id } = req.params;
  try {
    const post = await Post.getById(id);
    if (post) {
      req.post = post;
      next();
    } else {
      const err = new Error('invalid id');
      err.statusCode = 404;
      next(err);
    }
  } catch (err) {
    err.statusCode = 500;
    err.message = 'error retrieving a post';
    next(err);
  }

}

//----------------------------------------------------------------------------//
// checkPayload middleware
//----------------------------------------------------------------------------//
// This method validates that the body contains the right data.
// 
// Our SQLite database is configured to disallow adding records that do not have
// both a title value and a contents value. In this "checkPayload" method, we
// can validate that the request body includes both a title and a contents
// property. 
// 
// If not, we will call the error handling middleware with a 404 error object. 
// 
// Otherwise, we call next() to go to the next handler. 
//----------------------------------------------------------------------------//
function checkPayload(req, res, next) {
  const body = req.body;
  if (!body.title || !body.contents) {
    const err = new Error('body must include "title" and "contents"');
    err.statusCode = 400;
    next(err);
  } else {
    next();
  }

}

module.exports = router
