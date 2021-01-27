// Almost there... take a peek at ../../data/db-config.js...
const db = require('../../data/db-config.js');

module.exports = {
  get,
  getById,
  create,
  update,
  remove,
}

//----------------------------------------------------------------------------//
//  get posts from the 'posts' table
//----------------------------------------------------------------------------//
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
async function get() {
  const sql = await db('posts').toString();
  console.log(sql);

  const posts = await db('posts'); // db.select('*').from('posts');
  return posts;
}
//----------------------------------------------------------------------------//
//  get a single record by it's ID
//----------------------------------------------------------------------------//
//  This model method returns a single post, if the ID in the URL is valid.
// 
//  This example uses the second syntax, with async/await promise handling.
// 
// Note that .select() returns an array of records that match the
// criteria. If there are multiple records that match, the array has multiple
// elements. If there is one record that matches, the array has a single
// element. If there are no records that match, the array is empty. 
// 
// The .first() method is just like .select(), except it adds LIMIT 1 to the SQL
// query, so if there are any records that match the request, whether 1 or more,
// it only returns the first one. It does NOT return an array. If there are no
// records that match the query, it returns an unassigned value (or null value).
// 
// If you use .select(), you should destructure the first element of the array
// into an object to return, so the middleware that validates whether or not the
// ID matches a record can use the 'truthiness' of the result to determine if
// the ID is valid. An empty array is "truthy" (it's empty, but it is not null
// or unassigned - it's an array.)
// 
// Using .first() makes it simpler, but the following two statements are
// identical in their result (although the SQL is not the same - the one with
// .first() adds LIMIT 1 to the request.)
// 
//     const [post] = await db('posts').select(*).where({id});
//     const post = await db('posts').where({id}).first();
//----------------------------------------------------------------------------//
async function getById(id) {
  const post = await db.first('*').from('posts').where({ id });
  // could also be:
  //     const [post] = await db.select('*').from('posts').where({id});
  return post;
}

//----------------------------------------------------------------------------//
//  create a new record in the posts table
//----------------------------------------------------------------------------//
//  This model method allows the creation of a new post.
// 
//  This example uses the second syntax, with async/await promise handling.
//----------------------------------------------------------------------------//
async function create(data) {
  const [postId] = await db.insert(data).into('posts');
  const post = await getById(postId);
  return post;
}

//----------------------------------------------------------------------------//
//  update a record
//----------------------------------------------------------------------------//
//  This method allows the modification of an existing post ("update")
// 
//  This example uses the first syntax, with .then().catch() promise handling.
//----------------------------------------------------------------------------//
function update(id, changes) {
  db('posts').where({ id }).update(changes)
    .then(count => {
      return count;
    })
    .catch(err => {
      throw err;
    });
}

//----------------------------------------------------------------------------//
//  delete a record
//----------------------------------------------------------------------------//
//  This method allows the deletion of an existing post.
// 
//  This example uses the second syntax with async/await promise handling.
// 
//  Note that it also uses the "ternary" operator to handle the result of the
//  delete, rather than an if()..else() statement.
//----------------------------------------------------------------------------//
async function remove(id) {
  const count = await db.del().from('posts').where({ id });
  return count;
}

//----------------------------------------------------------------------------//
// EXTRA CREDIT
//
// We didn't even remotely cover this in class, and it's not at all required for
// you to do well in this course, but it's interesting stuff, if you are
// curious... 
// 
// Knex has the ability for us to install "query event handlers" - functions tht
// are called every time Knex performs a query. This is useful for logging, and
// for troubleshooting. 
// 
// The callback that the event handler registers will be given a "toSql" object,
// which contains various values. The two that really matter to us are the
// .bindings and .sql. The .bindings property is an array of values used in the
// sql statement (i.e. the parts of the sql statement that are not actually SQL
// itself - the values we supply, like table names, field names, etc.) The .sql
// string is the actual sql statement, without the actual values. Knex will
// combine the .bindings values with the .sql statement before sending to the
// sqlite3 db client. 
// 
// Here, we are using it to simply log the sql object to the console, for fun.
//----------------------------------------------------------------------------//
db.on('query', (toSqlObject) => {
  console.log(toSqlObject);
});
