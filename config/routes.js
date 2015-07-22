/**
 * New node file
 */
var routes = require('../routes');

module.exports = function (app) {
  app.get('/', routes.index);
  app.post('/', routes.index);
  app.del('/', routes.index);
  app.get('/keep', routes.keep);
  app.post('/keep/add', routes.addrequest);
  app.get('/request_list/:pagenum([0-9]+)?', routes.requests);
  app.get('/request_list/download/pdf', routes.download);
};