/**
 * New node file
 */
var roomid = "29828389";
var token = "b67604e57259cccf6c6ed2ffaa85a6eb";

var opts = require("opts");
var request = require("request");
request = request.defaults({jar: true});

opts.parse([
            {
              'short': 'num',
              'long': 'buildnum',
              'description': 'Build Number',
              'value': true,
              'required': false
            },
            {
              'short': 't',
              'long': 'title',
              'description': 'Information Title',
              'value': true,
              'required': false
            },
            {
              'short': 'm',
              'long': 'message',
              'description': 'Notification Message',
              'value': true,
              'required': false
            },
            {
              'short': 'l',
              'long': 'link',
              'description': 'Read more on the web site.',
              'value': true,
              'required': false
            }
            ]
);

var opt_num = opts.get('num');
var opt_title = opts.get('t') || "Information";
var opt_message = opts.get('m') || "";
var opt_link = opts.get('l') || "";


if (opt_num) {
  var ci_options = {
      url: 'https://circleci.com/api/v1/project/shallontecbiz/TireKeeperPrototype/' + opt_num + '?circle-token=6f88a980ad5535811d13849df0325f875dc13a9d',
      json: true
  };
  
  request.get(ci_options, function(error, response, body) {
    console.log(response.statusCode);
    if(error || response.statusCode !== 200) {
      return console.error(error);
    } else {
      var title = body.steps[17].actions[0].status + ' : ' + body.reponame + '/' + body.branch + ' #' + body.build_num;
      chatPost(title, body.subject, body.build_url);
    }
  });
} else {
  chatPost(opt_title, opt_message, opt_link);
}

function chatPost(title, message, link) {
  var chat_options = {
      url: "https://api.chatwork.com/v1/rooms/" + roomid + "/messages",
      headers: {
        'X-ChatWorkToken': token
      },
      form: {
        body: "[info]" +
            "[title]" + title + "[/title]" +
            message + "\n" + link +
            "[/info]"
      },
      json: true
  };
  
  request.post(chat_options, function(error, response, body) {
    console.log(response.statusCode);
    if(error || response.statusCode !== 200) {
      return console.error(error);
    }
  });
}