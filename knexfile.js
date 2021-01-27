//----------------------------------------------------------------------------//
//  KNEXFILE.JS...
//----------------------------------------------------------------------------//
//  knexjs is a "query builder" - it provides a consistent interface to us as
//  software developers, so that we can "write once, run anywhere" database
//  access code. Using knex insulates us from the differences between different
//  database systems when it comes to little nuances and customizations to the
//  SQL language implemented by each RDBMS.
//
//  This file contains the configuration data for knex. This is how we tell knex
//  what database we are using (SQLite3, MySQL, Postgres, etc.), and this is how
//  we provide the configuration settings that knex needs in order to actually
//  access the database.
// 
//  In the case of SQLite3, which is a file-based database (i.e. it's not a
//  client/server database that you have to communicate with through a REST API,
//  or a TCP-based API, etc.). So, one of the key things we need to tell knex
//  about our SQLite3 database is "where the database file is" (the path to it).
// 
//  Note that knex doesn't have the smarts built into it to allow it to
//  communicate directly with the database system of our choice. Rather, it uses
//  other modules to do that.
// 
//      {our_app} <==> {knex} <==> {database_library} <==> {database_system}
// 
//  So, in addition to adding the knex npm package to our project, we also have
//  to add the package that knex depends on in order to connect to our actual
//  database instance (whether "connecting to" it means "open the database file
//  and read/write it", or "send API calls across the network to a database
//  server", etc.).
// 
//  In the case of a SQLite3 database, we need to "npm i knex" (or "yarn add
//  knex"), AND we need to "npm i sqlite3" (or "yarn add sqlite3").
// 
//  See http://knexjs.org/#Installation-node for more info.
// 
//  As an example of how 2 RDBMS's can differ in their SQL syntax, making it
//  hard to write code directly against one database, and then convert to the
//  other, consider that:
// 
//      * MySQL has special AUTO_INCREMENT keyword when declaring primary key 
//        columns (SQLite doesn't) 
//      * MySQL has data types that aren't supported in SQLite, such as 
//        TIMESTAMP, ENUM, SET, and BIT. In MySQL 5.6, time datatypes have 
//        optional precision.
//      * MySQL has table options in a CREATE TABLE statement to declare the 
//        storage engine, row format, partitioning, etc. SQLite doesn't.
//      * MySQL has statements like REPLACE and INSERT...ON DUPLICATE KEY UPDATE 
//        that are not supported by other brands.
//      * MySQL has dozens of built-in functions that are not necessarily 
//        supported by SQLite. 
//      * In some cases, arguments supported by MySQL are not supported by 
//        SQLite, e.g. COALESCE() with only a single argument.
//      * RIGHT OUTER JOIN is not supported by SQLite.
// 
//  (Above list taken from 
//    https://www.quora.com/Can-the-same-SQL-query-in-MySQL-be-used-in-sqlite)
//
//  Note that all of these "goodies" that MySQL has doesn't necessarily make it
//  superior to SQLite... it also has a HUGE footprint that would make it
//  inappropriate for a mobile application, where SQLite3 would excel.
//
//  The point is that knex insulates us from all of these kinds of differences.
//  That library knows how to take advantage of different capabilities of
//  different RDBMS's, and we don't have to be experts in all of them. And when
//  we need to change to another RDBMS, the work is as minimal as creating a new
//  config file, and adding a new database package to our package.json.
//  
//  See ./data/db-config.js for related information...
// 
module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './data/posts.db3',
    },
    useNullAsDefault: true,
    migrations: {
      directory: './data/migrations',
    },
    seeds: {
      directory: './data/seeds',
    },
  },
};
