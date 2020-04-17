'use strict';
/**
 * 生成请求签名及uri编码
 */
var crypto = require('crypto');
var debug = require('debug')('sign');

/*
* 兼容php的urlencode
*
* @param {string} str 需要url编码的字符串
* @return {string} 编码后的字符串
*/ 
function fullEncodeURIComponent (str) {
    var rv = encodeURIComponent(str).replace(/[!'()*~]/g, function(c) {
      return '%' + c.charCodeAt(0).toString(16).toUpperCase();
    });
    return rv.replace(/\%20/g,'+');
}

/**
 * 生成请求签名
 * 
 * @param {object} reqParams, 由url.parse解析出来的对象内容,描述请求的位置和url及参数等信息的对象
 * @param {object} postParams post表单内容
 * @param {string} secretKey 开发者中心的SK
 * @return {string} 签名值
 */
 module.exports = function (reqParams, postParmas, secretKey) {

    var basekey = "";

    var method = reqParams.method.toUpperCase();
    var baseurl = reqParams.href;
    var query = reqParams.query || false;
    var param = {};
    var paramStr = '';

    if (query) {
        query = querystring.parse(query);
        for ( var key in query) {
            param[key] = query[key];
        }
    }

    if (postParmas) {
        for ( var key in postParmas) {
            param[key] = postParmas[key];
        }
    }

    var keys = Object.keys(param).sort();

    keys.forEach(function (key) {
        paramStr += key + "=" + param[key];
    })

    basekey = method + baseurl + paramStr + secretKey;

    debug("basekey : ", basekey);

    var md5 = crypto.createHash('md5');

    basekey = fullEncodeURIComponent(basekey);

    md5.update(basekey);

    return md5.digest('hex');
};
