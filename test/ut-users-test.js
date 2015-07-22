/**
 * TIREKE 単体試験－ユーザサンプル
 *
 * Mochaとshould.jsを利用したサーバサイドのみのテスト
 * モデル配下のロジックに対する単体テスト
 */
var mongoose = require("mongoose");
var user = require("../models/users");
var async = require("async");
var config = require("config");
var message = require('../utils/message');
var should = require('should');

mongoose.connect(config.db);

describe('TIREKE 単体試験－ユーザサンプル', function() {
  before(function(done) {
    console.log('login before');
    // テストが始まる前の処理
    var User;
    var users = require('../tools/users');

    async.series([
	      function(callback) {
	        // 定義したときの登録名で呼び出し
	        User = mongoose.model('users');
	        // 初期化
	        User.remove(function(err) {
	          callback(null, 1);
	        });
	      },
	      function(callback) {
	        // データ作成
	        User.create(users, function(err) {
	          callback(null, 2);
	        });
	      }
     ],
     function(err, results) {
       done();
     }
    );
  });

  after(function(done) {
    console.log('login after');
    // テストが終わった後の処理
    done();
  });

  beforeEach(function(done) {
    console.log('login beforeeach');
    // 各テストごとの始まる前の処理
    done();
  });

  afterEach(function(done) {
    console.log('login aftereach');
    // 各テストごとの終わった後の処理
    done();
  });

  it('検証が正常に通ること', function(done) {
    var param = {
        user_id : 'test1',
        pwd : 'password1'
        };
    user.validate(param, function(err, userInfo) {
      should.not.exist(err);
      done();
    });
  });

  it('検証がエラーになること', function(done) {
    var param = {
        user_id : 'zzzzz',
        pwd : 'password1'
        };
    user.validate(param, function(err, userInfo) {
      err.msg.should.equal(message.get('loginErr'));
      done();
    });
  });

});
