//----------------------------------------------------------------------------//
//  See knexfile.js for some important info about knex. :)
//----------------------------------------------------------------------------//
//  If you want to see how our project actually "require()'s" knex, and
//  configures it, ...
//  ...follow the yellow brick road...
//  
//  (open ./api/server.js and see what it "requires"...)
const server = require("./api/server.js");

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
