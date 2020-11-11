const express = require('express');

// Almost there... take a peek at ./data/db-config.js...
const db = require('../data/db-config.js');

const router = express.Router();

//----------------------------------------------------------------------------//
// Query Event handler
// 
// The query event handler is called every time Knex performs a query. We can
// use it to console.log() the sql statement Knex built to do the query before
// it sends it to the sqlite3 database driver. This is good for education and
// troubleshooting. 
// 
// The callback that the event handler registers will be given a "toSql" object,
// which contains various values. The two that really matter to us are .bindings
// and .sql. The .bindings property is an array of values used in the sql
// statement (i.e. the parts of the sql statement that are not actually sql
// statements.) The .sql string is the actual sql statement, without the actual
// values. Knex will combine the .bindings values with the .sql statement before
// sending to the sqlite3 db driver.
//----------------------------------------------------------------------------//
db.on('query', (toSqlObject) => {
    console.log(toSqlObject);
});


//----------------------------------------------------------------------------//
//  GET /api/posts/
//----------------------------------------------------------------------------//
router.get('/', async (req, res) => {
    // The syntax for knex is similar to a SQL statement:
    //  * specify the action (select, delete, update, etc.)
    //  * specify the location (i.e. table name)
    //  * implement filters and other clauses (like where and order by)
    //
    // The knex API is a promise-based API. So the methods return a promise (or
    // a promise-like object, with .then() and .catch()).
    //
    // This means that we can use .then().catch() syntax, or async/await syntax.
    //
    // In addition, knex provides different syntaxes for using its api.
    //
    // - First syntax: You can call the knex object (named "db" here), and
    //   specify as a parameter the "location" (table name) that you want to
    //   perform an action.
    //
    // - Second syntax: You can call the action method on the knex object, and
    //   specify the location (table name) using methods that are similar to SQL
    //   statements.
    //
    // For example:
    //
    //    db('table1').select('column1', 'column2').where({conditions}) 
    //
    //      or
    //
    //    db.select('column1', 'column2').from('table1').where({conditions})
    //
    // These are the same. The second one reads more like a SQL statement.
    //
    // In this example, we are using the first syntax, with async/await
    // handling of the returned promise.
    try {
        const posts = await db('posts');
        res.json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "error retrieving posts", err });
    }
});

//----------------------------------------------------------------------------//
//  GET /api/posts/:id
//----------------------------------------------------------------------------//
//  This middleware returns a single post, if the ID in the URL is valid.
// 
//  This example uses the second syntax, with async/await promise handling.
//----------------------------------------------------------------------------//
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const post = await db.select('*').from('posts').where({ id }).first();
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({ message: "Post not found" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "sorry, ran into an error" });
    }
});

//----------------------------------------------------------------------------//
//  POST /api/posts
//----------------------------------------------------------------------------//
//  This middleware allows the creation of a new post.
// 
//  This example uses the second syntax, with async/await promise handling.
//----------------------------------------------------------------------------//
router.post('/', async (req, res) => {
    const postData = req.body;

    try {
        const post = await db.insert(postData).into('posts');
        res.status(201).json(post);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'db problem', error: err });
    }


});

//----------------------------------------------------------------------------//
//  PUT /api/posts/:id
//----------------------------------------------------------------------------//
//  This middleware allows the modification of an existing post ("update")
// 
//  This example uses the first syntax, with .then().catch() promise handling.
//----------------------------------------------------------------------------//
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const changes = req.body;

    db('posts').where({ id }).update(changes)
        .then(count => {
            if (count) {
                res.status(200).json({ updated: count });
            } else {
                res.status(404).json({ message: 'invalid id' });
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'db problem', error: err });
        });


});


//----------------------------------------------------------------------------//
//  DELETE /api/posts/:id
//----------------------------------------------------------------------------//
//  This middleware allows the deletion of an existing post.
// 
//  This example uses the second syntax with async/await promise handling.
// 
//  Note that it also uses the "ternary" operator to handle the result of the
//  delete, rather than an if()..else() statement.
//----------------------------------------------------------------------------//
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const count = await db.del().from('posts').where({ id });
        count ? res.status(200).json({ deleted: count })
            : res.status(404).json({ message: 'invalid id' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'database error', error: err });
    }


});

module.exports = router;