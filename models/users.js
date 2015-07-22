/**
 * New node file
 */
var mongo = require('mongoose');
var message = require('../utils/message');

//Defaultのスキーマから新しいスキーマを定義
var UserSchema = new mongo.Schema({
  user_id: String,
  pwd: String,
  name: String,
  role: { type: Number, min: 0, max: 2 },
  create_date: Date,
  update_date: Date
});

// ドキュメント保存時にフックして処理したいこと
UserSchema.pre('save', function(next) {
  var doc = this;
  doc.create_date = doc.update_date = new Date();
  next();
});

//モデル化。model('[登録名]', '定義したスキーマクラス')
mongo.model('users', UserSchema);

//定義したときの登録名で呼び出し
var User = mongo.model('users');

exports.validate = function (user, cb) {
  var error;
  User.findOne({user_id:user.user_id, pwd:user.pwd}, function(err, doc) {
    if (err) {
      throw err;
    }
    if (!doc) {
      error = {msg: message.get('loginErr')};
    }
    cb(error, doc);
  });
};
