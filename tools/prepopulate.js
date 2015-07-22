/**
 * New node file
 */
var requests = require('./requests');
var users = require('./users');

var async = require('async');
var mongo = require('mongoose');

// Default Schemaを取得
var Schema = mongo.Schema;

// Defaultのスキーマから新しいスキーマを定義
var UserSchema = new Schema({
  user_id: String,
  pwd: String,
  name: String,
  role: { type: Number, min: 0, max: 2 },
  create_date: Date,
  update_date: Date
});

// ドキュメント保存時にフックして処理したいこと
UserSchema.pre('save', function(next) {
  this.create_date = this.update_date = new Date();
  next();
});

// モデル化。model('[登録名]', '定義したスキーマクラス')
mongo.model('users', UserSchema);

// Defaultのスキーマから新しいスキーマを定義
var RequestSchema = new Schema({
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
  this.create_date = this.update_date = new Date();
  next();
});

// モデル化。model('[登録名]', '定義したスキーマクラス')
mongo.model('requests', RequestSchema);

// request_no のsequence
var SequenceSchema = new Schema({
  _id: String,
  value: Number
});
//モデル化。model('[登録名]', '定義したスキーマクラス')
mongo.model('sequence', SequenceSchema);

var User;
var Request;
var Sequence;

mongo.connect('mongodb://localhost:27017/tireke');
async.series([
              function(callback) {
                // 定義したときの登録名で呼び出し
                User = mongo.model('users');
                // 初期化
                User.remove(function(err) {
                  if (err) {
                    console.log(err);
                  }
                  console.log('users clear');
                  callback(null, 1);
                });
              },
              function(callback) {
                // データ作成
                User.create(users, function(err) {
                  if (err) {
                    console.log(err);
                  }
                  console.log('users create');
                  callback(null, 2);
                });
              },
              function(callback) {
                // 定義したときの登録名で呼び出し
                Request = mongo.model('requests');
                // 初期化
                Request.remove(function(err) {
                  if (err) {
                    console.log(err);
                  }
                  console.log('requests clear');
                  callback(null, 3);
                });
              },
              function(callback) {
                // データ作成
                Request.create(requests, function(err) {
                  if (err) {
                    console.log(err);
                  }
                  console.log('requests create');
                  callback(null, 4);
                });
              },
              function(callback) {
                // 定義したときの登録名で呼び出し
                Sequence = mongo.model('sequence');
                // 初期化
                Sequence.remove(function(err) {
                  if (err) {
                    console.log(err);
                  }
                  console.log('sequence clear');
                  callback(null, 5);
                });
              },
              function(callback) {
                // データ作成
                Sequence.create({ _id: "request_no", value: 4 }, function(err) {
                  if (err) {
                    console.log(err);
                  }
                  console.log('sequence create');
                  callback(null, 6);
                });
              }
             ],
             function(err, results) {
               if (err) {
                 
                 throw err;
               }
               console.log(results);
               setTimeout(function () {
                 process.exit(0);
               }, 1000);
             }
);
