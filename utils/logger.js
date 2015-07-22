var config = require('config');
var log4js = require('log4js');
log4js.configure(config.log4js.configure);

var loggerSys = log4js.getLogger('system'),
    loggerErr = log4js.getLogger('error'),
    loggerAcs = log4js.getLogger('access');

// expressに渡すアクセスログ設定
exports.accessConfig = log4js.connectLogger(loggerAcs, { level: log4js.levels.INFO });

// アプリケーションログ
exports.info = function(InStr){
  loggerSys.info(InStr);
};

// エラーログ（警告レベル）
exports.warn = function(InStr){
  loggerErr.warn(InStr);
};
// エラーログ（エラーレベル）
exports.error = function(InStr){
  loggerErr.error(InStr);
};
// エラーログ（緊急レベル）
exports.fatal = function(InStr){
  loggerErr.fatal(InStr);
};