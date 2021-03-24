//----------------------------------------------------------------------------//
//  Knex Magic
//----------------------------------------------------------------------------//
//  This is the place where knex is hooked up to our application.
//
//  Knex is a "query builder" - a library that assists in forming a valid SQL
//  query in the dialect of whatever database you are using. In this project, we
//  are using SQLite3, which is supporeted by knex. If there are idiosynchrosies
//  or oddities about SQLite3's variant of SQL, they are abstracted from us...
//  we don't have to know about them or care. We aren't writing to SQLite3. We
//  are writing to knex. Knex writes to SQLite3 for us.
//
//  Through the configuration of knex, we specify what database we are actually
//  using, and we provide knex with whatever information it needs in order to
//  access that database.
//
//  The knexfile.js file specifies that we are using SQLite3, and specifies
//  where our database file is. This is how knex knows where to send the SQL
//  queries once it builds them.
//
//  We instruct knex in how to build whatever SQL command we want by using the
//  knex methods. These are documented at https://knexjs.org. The methods
//  closely resemble the actual standard SQL statements (with a few exceptions
//  where the SQL statement is actually a JavaScript "reserved word", and it's
//  not possible to name a method or property with that word - like "delete".)
//
//  Once we get a handle to the knex system (the first "require()"
//  statement...), we then pass in a configuration JSON object to it. We get the
//  configuration JSON object from the ../knexfile.js, where it is exported. It
//  is typical for knexfile.js to export an object with a different property for
//  our "development" environment, and a different one for "production", etc.
//
//  See the knexfile.js for more info. (By the way, "knexfile.js" is an
//  arbitrary name. You can call it "rainbow_unicorns_rule.js" if you want. You
//  just have to point to it in order to import what it is exporting... you
//  could also create the config object here and pass it directly...
//  ...HOWEVER... this file isn't the only place that the configuration is used.
//  There are other knex-related utilities that we will learn about later
//  (migration and seeds) that will want this configuration information, and
//  those utilities look in the root of the project folder for a file named
//  "knexfile.js" by default. Since we don't want to maintain 2 different config
//  objects (every time you need to make a change, you'd have to change your
//  underpants also, because you would no longer be DRY... get it? DRY?? I
//  thought it was clever...)
// 
//  See ../knexfile.js for related information...
// 
const knex = require('knex');

const config = require('../knexfile.js');

module.exports = knex(config.development);