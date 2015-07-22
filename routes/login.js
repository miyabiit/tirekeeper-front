/*
 * GET home page.
 */
var user_model = require('../models/users');

module.exports = function(req, res, next) {
  var method = req.method.toLowerCase();
  var user = req.body.user;
  var logout = (method === 'delete');
  var login = (method === 'post' && user);
  
  routes = req.app.routes[method];
  
  if (!routes) {
    next();
    return;
  }
  
  if (login || logout) {
    routes.forEach(function(route) {
      if (!(req.url.match(route.regexp))) {
        req.method = 'GET';
      }
    });
  }
  
  if (logout) {
    delete req.session.user;
  }
  
  if (login) {
    user_model.validate(user, function(err, userInfo) {
      if (!err) {
        req.session.user = {
          user_id : user.user_id,
          pwd : user.pwd,
          name : userInfo.name,
          role : userInfo.role
        };
        res.redirect('/keep');
      } else {
        req.flash('error', err.msg);
        req.url = '/';
      }
      next();
    });
  } else {
    if (!req.session.user) {
      req.url = '/';
    }
  
    next();
  }
};
