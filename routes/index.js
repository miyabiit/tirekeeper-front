/*
 * GET home page.
 */
var request_model = require('../models/requests');
var config = require('config');

exports.index = function(req, res) {
  res.render('index', {
    title : 'TIREKE | トップ',
    mainmenu : '',
    submenu : ''
  });
};

exports.keep = function(req, res) {
  res.render('keep', {
    title : 'TIREKE | 引取依頼',
    mainmenu : 'request',
    submenu : 'keep'
  });
};

exports.requests = function(req, res) {
  request_model.pull(req.params.pagenum, function(err, requests) {
    if (err) {
      console.log(err);
    }
    res.render('request_list', {
      title : 'TIREKE | 依頼状況',
      mainmenu : 'request',
      submenu : 'request_list',
      requests: requests,
      page: req.params.pagenum
    });
  });
};

exports.addrequest = function(req, res) {
  var request = req.body;

  request_model.add(request, req.session.user, function(err) {
    if (err) {
      console.log(err);
    }
    res.redirect(req.header('Referrer') || '/');
  });
};
exports.download = function(req, res) {
  var request = require("request");
  request = request.defaults({jar: true});

  var loginOptions = {
    url: config.reportServer.url + "/rest/login",
    qs: {
      j_username: config.reportServer.username,
      j_password: config.reportServer.password
    }
  };
  request.post(loginOptions, function(loginError, loginResponse, loginBody) {
    console.log(loginResponse.statusCode);
    if(loginError) {
      return console.error(loginError);
    }

    var options = {
      url: config.reportServer.url + "/rest_v2/reports/reports/TIREKE/TirekeSample.pdf",
      encoding: null
    };
    request.get(options, function(reportError, reportResponse, reportBody) {
      console.log(reportResponse.statusCode);
      if(reportError) {
        return console.error(reportError);
      }
      res.set({
        'Content-type': reportResponse.headers['content-type'],
        'Content-disposition': reportResponse.headers['content-disposition']
      });
      res.send(reportBody);
    });
  });
};
