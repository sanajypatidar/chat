BaiduPush
=======

Node.js SDK for [baidu push service](http://push.baidu.com/), which is a free, simple, easy scale push service. It support IOS & Android platform. It is a good choice for China app developers. 

### Install

```
npm install baidu_push
```

### Example

```
var BaiduPush = require('baidu_push');
var sender = new BaiduPush({
    apiKey: '',
    secretKey: ''
});

// classic Node.js callback usage
sender.pushSingle({
    channel_id: '3748092266370017686',
    msg_type: 1,
    msg: JSON.stringify({title: 'Hello baidu push notification'})
}, function (err, data) {
    console.log(err, data);
});

// use in promise way
sender.pushSingle({
    channel_id: '3748092266370017686',
    msg_type: 1,
    msg: JSON.stringify({title: 'Hello baidu push notification'})
}).then(function (data) {
    console.log(data);
}).catch(function (err) {
    console.log(err);
});
```

If you provide a callback function as the second parameter, it will be the classic node.js version.
Otherwise it will return a promise.


### APIs

This package provide all the methods correspond to Baidu's REST APIs, all method use POST method to
invoke Baidu's API.

* pushSingle  ---  推送消息到单台设备
* pushAll  ---  推送广播消息
* pushTags  ---  推送组播消息
* pushBatchDevice  ---  推送消息到给定的一组设备(批量单播)
* reportQueryMsgStatus  ---  查询消息的发送状态
* reportQueryTimerRecords  ---  查询定时消息的发送记录
* reportQueryTopicRecords  ---  查询指定分类主题的发送记录
* appQueryTags  ---  查询标签组列表
* appCreateTag  ---  创建标签组
* appDelTag  ---  删除标签组
* tagAddDevices  ---  添加设备到标签组
* tagDelDevices  ---  将设备从标签组中移除
* tagDeviceNum  ---  查询标签组设备数量
* timerQueryList  ---  查询定时任务列表
* timerCancel  ---  取消定时任务
* topicQueryList  ---  查询分类主题列表
* reportStatisticDevice  ---  当前应用的设备统计信息
* reportStatisticTopic  ---  查询分类主题统计信息

For the detail api info and message structure you can find in Baidu's [documentation](http://push.baidu.com/doc/restapi/restapi)

### Test

```
$ npm test
```


### TODO
    1. support url schema option
