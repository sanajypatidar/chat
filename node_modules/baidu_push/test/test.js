var assert = require('assert');
var BaiduPush = require('../lib/index.js');

describe('baiduPush test', function () {
    // test data
    var APIKEY = "BG2gBo7mED2MIBuKL9FIVlyO";
    var SECRETKEY = "Ihp8XYybpz4ZGEFsB7sxIED1o6Sl6sbi";
    var userId = '773050392649073364';
    var channelId = '3748092266370017686';
    var baiduPush = new BaiduPush({
        apiKey: APIKEY,
        secretKey: SECRETKEY
    });


    it('Cbk version test', function (done) {
        baiduPush.pushSingle({
            channel_id: '3748092266370017686',
            msg_type: 1,
            msg: JSON.stringify({title: 'hellomsgssss'})
        }, function (err, data) {
            assert.equal(err, null, 'There should no error');
            assert.equal(typeof data, 'object', 'Data should be a object');
            assert.ok(data.request_id, 'Should have value');
            assert.ok(data.response_params, 'Should have value');
            assert.ok(data.response_params.msg_id, 'Should have value');
            assert.ok(data.response_params.send_time, 'Should have value');
            done();
        });
    });


    it('Promise version test', function (done) {
        baiduPush.pushSingle({
            channel_id: '3748092266370017686',
            msg_type: 1,
            msg: JSON.stringify({title: 'hellomsgssss'})
        }).then(function (data) {
            assert.equal(typeof data, 'object', 'Data should be a object');
            assert.ok(data.request_id, 'Should have value');
            assert.ok(data.response_params, 'Should have value');
            assert.ok(data.response_params.msg_id, 'Should have value');
            assert.ok(data.response_params.send_time, 'Should have value');
            done();
        }).catch(function (err) {
            assert.equal(err, null, 'There should no error');
            done();
        })
    })

});

