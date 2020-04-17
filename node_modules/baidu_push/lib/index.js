'use strict';
/*
*   BaiduPush -- Baidu push service Node.js SDK
*/
var util = require('util');
var request = require('request');
var signKey = require('./sign.js');
var apiConfigs = require('./apiConfig.json');
// import the promise polyfill
if (typeof Promise === 'undefined') {
    var Promise = require('es6-promise').Promise;
}

module.exports = BaiduPush;

/*
* 百度推送类
*
* @param {Object} options 百度推送服务配置: apiKey, secretKey
* @return {Object} 百度推送对象实例
*/
function BaiduPush (options) {
    if (!options || !options.apiKey || !options.secretKey) {
        throw new Error('apiKey and secretKey is required');
    }
    this.options = options;
    return this;
}

// dynamic add REST API methods from config
var proto = {};
apiConfigs.forEach(function (config) {
    proto[config.name] = createApi(config);    
});
BaiduPush.prototype = proto;



// help methods ==================================

// default headers & method
var defaultHeaders = {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    'User-Agent': 'BCCS_SDK/3.0 (Darwin; Darwin Kernel Version 14.0.0: Fri Sep 19 00:26:44 PDT 2014; root:xnu-2782.1.97~2/RELEASE_X86_64; x86_64) PHP/5.6.3 (Baidu Push Server SDK V3.0.0 and so on..) cli/Unknown ZEND/2.6.0'
};
var defaultMethod = 'POST';

/*
* basic request helper method
*
* @param {Object} options 百度推送服务配置
* @return {promise} 若提供了回调函数, 返回结果以回调的形式返回, 如果没有提供回调函数, 返回promise对象 
*/
function invokeBaidu(options, cbk) {
    // check required parameters
    if (!options || !options.uri || !options.params) {
        throw new Error('Lack required parameters');
    }
    //
    var uri = util.format("http://api.tuisong.baidu.com/rest/3.0/%s", options.uri);
    // build post params
    var params = options.params;
    params.timestamp = Math.round(Date.now() / 1000);
    params.apikey = options.apiKey;
    var httpInfo = {
        href: uri,
        method: defaultMethod
    };
    params.sign = signKey(httpInfo, params, options.secretKey);
    // build post options
    var requestOptions = {
        uri: uri,
        headers: defaultHeaders,
        method: defaultMethod,
        form: params
    };
    // do request (if provide callback function use the traditinal way, if not use promise way)
    if (typeof cbk === 'function') {
        request(requestOptions, function (err, response, body) {
            var result = dealResult(err, body);
            result.error ? cbk(result.error) : cbk(null, result.data);
        });
    } else {
        return new Promise(function(resolve, reject) {
            request(requestOptions, function(err, response, body) {
                var result = dealResult(err, body);
                result.error ? reject(result.error) : resolve(result.data);
            });
        });
    }
}

// request 返回结果处理
function dealResult (err, body) {
    var result = {};
    if (err) {
        result.error = err;
    } else {
        try {
            result.data = JSON.parse(body);
        } catch (e) {
            result.error = e;
        }
    }
    return result;
}

function createApi (config) {
    return function(params, cbk) {
        // check required params
        for (var i in config.requiredParams) {
            var p = config.requiredParams[i];
            if (!params[p.name]) {
                throw new Error(util.format('Required param "%s" is requied', p.name));
            }
        }
        // build request options
        var opts = {
            uri: config.uri,
            params: params,
            apiKey: this.options.apiKey,
            secretKey: this.options.secretKey
        };
        var args = [];
        args.push(opts);
        if (cbk) {
            args.push(cbk);
        }
        return invokeBaidu.apply(global, args);
    };
}