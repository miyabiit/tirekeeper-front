/**
 * New node file
 */
var mongo = require('mongoose');

//Defaultのスキーマから新しいスキーマを定義
var SequenceSchema = new mongo.Schema({
  _id: String,
  value: Number
});

//モデル化。model('[登録名]', '定義したスキーマクラス')
mongo.model('sequence', SequenceSchema);

// 定義したときの登録名で呼び出し
var Sequence = mongo.model('sequence');

exports.increment = function (key , cb) {
  Sequence.findByIdAndUpdate(key, {$inc:{value:1}}, function(err, doc) {
    if (err) {
      throw err;
    }
    cb(doc.value);
  });
};
