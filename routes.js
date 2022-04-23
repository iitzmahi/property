const routes = require('next-routes')();

routes
.add('/properties/new','properties/new')
.add('/properties/:address','/properties/show');

module.exports = routes;