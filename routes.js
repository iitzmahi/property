const routes = require('next-routes')();

routes
.add('/properties/new','properties/new')
.add('/viewProperty/listed/showListed','/viewProperty/listed/showListed')
.add('/viewProperty/showProperty','/viewProperty/showProperty')
.add('/properties/:address','/properties/show');

module.exports = routes;