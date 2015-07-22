/**
 * New node file
 */
var mongo = require('mongoose');
var sequence_model = require('../models/sequence');

var RequestSchema = new mongo.Schema({
  request_no: Number,
  user_id: String,
  menber_no: String,
  tel: String,
  mail: String,
  note: String,
  tire_id: String,
  state: { type: Number, min: 0, max: 2 },
  requested_date: Date,
  completion_date: Date,
  create_date: Date,
  update_date: Date
});

// ドキュメント保存時にフックして処理したいこと
RequestSchema.pre('save', function(next) {
  var doc = this;
  doc.state = 0;
  doc.requested_date = doc.create_date = doc.update_date = new Date();
  sequence_model.increment('request_no', function(no) {
    doc.request_no = no;
    next();
  });
});

// モデル化。model('[登録名]', '定義したスキーマクラス')
mongo.model('requests', RequestSchema);

//定義したときの登録名で呼び出し
var Request = mongo.model('requests');

exports.pull = function pull(page, cb) {
  var rowsPer = 5;
  var skip;
  var errs;

  page = page || 1;
  skip = (page - 1) * rowsPer;

  Request.find({}).sort('-request_no').limit(rowsPer).skip(skip).exec(function(err, doc) {
    if (err) {
      errs = errs || [];
      errs.push(err);
    }
    cb(errs, doc);
  });
};

exports.del = function(request, cb) {
  Request.remove(request, cb);
};

exports.add = function(request, user, cb) {
//  var new_doc = new Request(request);
  var new_doc = new Request({
	  menber_no: request.menber_no,
	  tel: request.tel,
	  mail: request.mail,
	  note: request.note
  });
  new_doc.user_id = user.user_id;

  new_doc.save(function(err) {
    cb(err);
  });
};

exports.validate = function (request, cb) {
  var error;

  cb(error);
};
