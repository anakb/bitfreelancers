const routes = require('next-routes')();

routes
  .add('/freelancers/new', '/freelancers/new')
  .add('/freelancers/:address', '/freelancers/show');

module.exports = routes;
