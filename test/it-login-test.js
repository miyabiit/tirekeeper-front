/**
 * TIREKE 結合試験－ログイン画面サンプル
 *
 * seleniumを使用したクライアント－サーバ間の自動化テスト
 * 事前にアプリサーバ、ＤＢサーバ、seleniumサーバを立ち上げておくこと
 */
var webdriver = require('selenium-webdriver');
var t = require('selenium-webdriver/testing');
var expect = require('expect.js');
var driver;
var By = webdriver.By;

// 各ブラウザのドライバを読み込み
var firefox = require('selenium-webdriver/firefox'),
	chrome = require('selenium-webdriver/chrome'),
	ie = require('selenium-webdriver/ie');

var until = require('selenium-webdriver').until;

t.describe('TIREKE 結合試験－ログイン画面サンプル', function() {

	t.before(function() {
		// Firefox
        driver = new webdriver.Builder()
        		.usingServer('http://localhost:4444/wd/hub')
        		.withCapabilities(webdriver.Capabilities.firefox())
        		.build();
        // Chrome
//        driver = new webdriver.Builder()
//				.usingServer('http://localhost:4444/wd/hub')
//				.withCapabilities(webdriver.Capabilities.chrome())
//				.build();
        // Internet Explorer
//        driver = new webdriver.Builder()
//				.usingServer('http://localhost:4444/wd/hub')
//				.withCapabilities(webdriver.Capabilities.ie())
//				.build();
	});

    t.after(function() {
        driver.quit();
    });

    t.it('正常にログインできること', function() {

    	driver.get('http://localhost:3000/').then(function() {

        	driver.findElement(By.name('user[user_id]'))
        			.sendKeys('test1');
        	driver.findElement(By.name('user[pwd]'))
        			.sendKeys('password1');

        	driver.findElement(By.tagName('form'))
        			.submit();

        	driver.wait(until.titleIs('TIREKE | 引取依頼'), 10000);
        	driver.wait(driver.findElement(By.name('menber_no')).getText(), 10000)
        			.then(function(text) {
        				expect(text).to.be.empty();
        			});
        });
    });

    t.it('エラーでログインできないこと', function() {

    	driver.get('http://localhost:3000/').then(function() {

    		driver.findElement(By.tagName('form'))
    				.submit();

        	driver.wait(until.titleIs("TIREKE | トップ"), 10000);
        	driver.wait(driver.findElement(By.name("message")).getText(), 10000)
        			.then(function(text) {
        	        	expect(text).to.be("ログイン情報に誤りがあります。");
        			});
    	});
    });
});
