
var port = process.env.PORT || 8000;
var morgan = require('morgan');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Client = require('mariasql');
var FCM = require('fcm-node');
var serverKey = 'AIzaSyBYA6nAkzJDEoHUpukk_pRzuaBh1Mo7AgI';
var fcm = new FCM(serverKey);
var connection = new Client({
    host:'localhost',
    user     : 'root',
    password : 'test1@',
    db : 'chat'
});
var Pushy = require('pushy');
var pushyAPI = new Pushy('0f7df325d08d4b0613f7c08607b7eb6770557f8a4a98f8f0ac5d455cfc200ddd');
var options = {    notification: {        badge: 1,        sound: 'ping.aiff',        body: 'Hello World \u270c'    },};
var BaiduPush = require('baidu_push');
var senderNo = new BaiduPush({
    apiKey: 'qD2Tws4zr11ZI2UrYUTEZGVl',
    secretKey: 'vCW4nHB0ZUvDa6TLauWtRug8aF8FGGzA'
});

function notificationsendgrp(obj)
{
     
            
 var data = {
    message: JSON.stringify(obj)
};
 
 
 var to = "test";
 
var options = {
    notification: {
        badge: 1,
        sound: 'ping.aiff',
        body: 'Hello World \u270c'
    },
};
 
 
pushyAPI.sendPushNotification(data, to, options, function (err, id) {
     if (err) {
        return console.log('Fatal Error', err);
    }
    
    // Log success 
    console.log('Push sent successfully! (ID: ' + id + ')');
});
    
    
}
function notificationsend(chatt,obj)
{
     obj.chattype = chatt;

            
 var data = {
    message: JSON.stringify(obj)
};
 
 
 var to = obj.did;
 
var options = {
    notification: {
        badge: 1,
        sound: 'ping.aiff',
        body: 'Hello World \u270c'
    },
};
 
 
pushyAPI.sendPushNotification(data, to, options, function (err, id) {
     if (err) {
        return console.log('Fatal Error', err);
    }
    
    // Log success 
    console.log('Push sent successfully! (ID: ' + id + ')');
});
    
    
}
app.use(morgan('dev'));

app.use(express.static(__dirname));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
var clients = {};
io.on('connection', function(socket){
    socket.on('userid', function(content){
	var arr= [];
        var obj = JSON.parse(content);
	obj.isChatEnable = JSON.parse(obj.isChatEnable);
	obj.isDelivered = JSON.parse(obj.isDelivered);
	obj.isReaded = JSON.parse(obj.isReaded);
        clients[obj.id] = {
		userId : obj.id,
		onlineStatus : true,
           "socket": socket.id
			};
	for(var name in clients) {
		arr.push(clients[name]);
        }
	io.emit('userOnline', {myId : arr});
connection.query('update `chat_demo` set `isread`="'+false+'",`deliver`="'+true+'" where `rcv_id`="'+obj.id+'" AND `isread`!="'+true+'"', function (err, rows, fields){});    
connection.query('UPDATE employee SET `userstatus` = "true" WHERE id = '+obj.id, function (err, rows, fields){});
});

	socket.on('disableUser',function(userObject){
		var obj = JSON.parse(userObject);
        if (clients[obj.id]){       
			clients[obj.id].onlineStatus = false;
			io.emit('disabledUser',clients[obj.id]);
			connection.query('UPDATE employee SET `userstatus` = "false" WHERE id = '+obj.id, function (err, rows, fields){});
       }
	});
socket.on('deleteMessage',function(userObject){
		var obj = JSON.parse(userObject);
console.log(obj);
        
			
//			io.emit('deletedMessage',clients[obj.id]);
connection.query('UPDATE employee SET `del` = concat(`del`, "'+obj.uid+'") WHERE id IN ('+obj.id+')', function (err, rows, fields){});
//  io.sockets.connected[clients[obj.reciverid].socket].emit('deletedMessage', obj.uid);
  io.emit('deletedMessage',obj.uid);      
	});



		socket.on('loadGroupChat',function(typingObject){
        var obj = JSON.parse(typingObject);
        var del = '';
console.log(obj.senderid);
 connection.query('SELECT `del`,`id`,`num` FROM `employee` WHERE `num` ="'+obj.senderid+'"', function (err, rows1, fields){      
del = rows1[0].del;
      console.log(del);
    

  var quer = 'select * from `group_chat` where `rcv_id`="'+obj.reciverid+'"  AND `uid` NOT IN ('+del+' ) AND `id` > (SELECT `id` FROM `group_chat` WHERE `message` = "'+obj.senderid+'"  AND `type` = "added" AND rcv_id = "'+obj.reciverid+'"  ORDER BY `id` DESC LIMIT 1 ) ORDER BY `id`';
        connection.query(quer, function (err, rows, fields){
console.log(quer);
	socket.emit('userMessageGroup',{result : rows});

	});
	});
});



    socket.on('typing',function(typingObject){
        var obj = JSON.parse(typingObject);
        if (clients[obj.reciverid]){
            io.sockets.connected[clients[obj.reciverid].socket].emit('onTyping', obj);
        } else {
            //console.log("User does not exist: " + obj.reciverid); 
        }
    });
	
	socket.on('notificationAlert',function(typingObject){
        var obj = JSON.parse(typingObject);
        if (clients[obj.id]){
//---------------------- FCM Notification --------------------------	
	var newarr = [];
	connection.query('select `chat_demo`.`message`,`chat_demo`.`type`,`chat_demo`.`datetime`,`chat_demo`.`send_id`,`chat_demo`.`rcv_id`,`employee`.`name` from `chat_demo`,`employee` where `chat_demo`.`isread`="'+false+'" AND `chat_demo`.`rcv_id`="'+obj.id+'" AND `employee`.`id`=`chat_demo`.`send_id`', function (err, rowss, fields){
	rowss.forEach(function(row12, index) {
        var Msgs = {
				title: row12.name,
			type:row12.type,	
            message: row12.message,
				date: row12.datetime,
				reciver: row12.rcv_id,
				sender: row12.send_id
			}
			
	newarr.push(Msgs);
	});
	var message = {
						to: obj.device_id, 
						collapse_key: 'Indira Security',
						
						notification: {
							title: 'Indira Security', 
							body: 'All'
						},
					    data: {
							result :{result :newarr}
						}
					};
					//console.log("Array Data",newarr);
		fcm.send(message, function(err, response){
			//console.log('RESPONSE ',response);
		});
		//console.log('MESSAGE',message);
	});
//----------------------FCM End--------------------------------
			
        } else {
            
        }
    });
	
    socket.on('stopTyping',function(typingObject){
	   var obj = JSON.parse(typingObject);
        if (clients[obj.reciverid]){
            io.sockets.connected[clients[obj.reciverid].socket].emit('onStopTyping', obj);
        } else {
            //console.log("User does not exist: " + obj.reciverid);
        }
    });
	socket.on('togglewindowstatus',function(typingObject){
        var obj = JSON.parse(typingObject);
	io.emit('toggledUser',obj);
        connection.query('UPDATE employee SET `window_status` = "'+obj.isChatEnable+'" WHERE id = '+obj.id, function (err, rows, fields){});
	connection.query('update `chat_demo` set `isread`="'+true+'",`deliver`="'+true+'" where `send_id`="'+obj.reciverid+'" AND `rcv_id`="'+obj.id+'"', function (err, rows, fields){});
	
	});
	socket.on('loadRecieverChat',function(typingObject){
        var obj = JSON.parse(typingObject);
        var del = '';
 connection.query('SELECT `del`,`id` FROM `employee` WHERE id ='+obj.senderid, function (err, rows1, fields){       del = rows1[0].del; console.log(del+"tes");
  var quer = 'select * from `chat_demo` where `rcv_id`="'+obj.reciverid+'" AND `send_id`="'+obj.senderid+'"  AND `uid` NOT IN ('+del+' ) UNION select * from `chat_demo` where `send_id`="'+obj.reciverid+'" AND `rcv_id`="'+obj.senderid+'"  AND `uid` NOT IN ('+del+') ORDER BY `id`';
        connection.query(quer, function (err, rows, fields){
console.log(quer);
	socket.emit('userMessage',{result : rows});
});
	});
	});
	
	socket.on('employeeList',function(typingObject){
		var arr = [];
		var obj = JSON.parse(typingObject);
		connection.query('select `id`,`name`,`photo`,`device_id` from `employee` order by `name`', function (err, rows, fields){
			rows.forEach(function(row, index) {
					var sndMsg = {
						id : row.id,
						name : row.name,
                        deviceid:row.device_id,

						photo : row.photo,
						path : 'http://192.168.0.158:90/indiracrm//assets/admin/images/profile/'
					}
					arr.push(sndMsg);
					if(index == rows.length-1){
						socket.emit('employeeListDetail',{result :arr});
					}
			});
		});
	});
	
	socket.on('chatCountList',function(typingObject){
		var arr = [];
		var arr1 = [];
		var obj = JSON.parse(typingObject);
		connection.query('select `send_id`,`rcv_id` from `chat_demo` where `send_id`="'+obj.senderid+'" OR `rcv_id`="'+obj.senderid+'" ORDER BY `datetime` DESC', function (err, rows, fields){
			rows.forEach(function(row, index) {
				arr.push(row.send_id);
				arr.push(row.rcv_id);
			});
			var uSet = new Set(arr);
			var myUniqueArray = [...uSet];
			if(myUniqueArray.length>0){
				connection.query('select `id` from `employee` where `del`=0 AND `id` IN ('+myUniqueArray+')', function (err, rows1, fields){
					rows1.forEach(function(row1, index1) {
						connection.query('select count(*) as `count` from `chat_demo` where `isread`="'+false+'" AND `rcv_id`="'+obj.senderid+'" AND `send_id`="'+row1.id+'"', function (err, rows2, fields1){
							var sndMsg = {
								id : row1.id,
								count : rows2[0].count
							}
							arr1.push(sndMsg);
							if(index1 == rows1.length-1){
								socket.emit('chatCountListDetails',{result :arr1});
							}
						});
					});
					
				});
			}
		});
	});


	socket.on('ChatemployeeListDetail',function(typingObject){
		var arr = [];
		var ary;
		var arr1 = [];
var del ="";
		var obj = JSON.parse(typingObject);
 connection.query('SELECT `del`,`id` FROM `employee` WHERE id ='+obj.senderid, function (err, rows1, fields){                   del = rows1[0].del;
console.log(del+"TTTEE");
		connection.query('select `send_id`,`rcv_id`,`uid` from `chat_demo` where `send_id`="'+obj.senderid+'" OR `rcv_id`="'+obj.senderid+'" AND `uid` NOT IN ('+del+' )  ORDER BY `datetime` DESC', function (err, rows, fields){
			rows.forEach(function(row, index) {
				arr.push(row.send_id);
				arr.push(row.rcv_id);
	});
			var uSet = new Set(arr);
			var myUniqueArray = [...uSet];
			myUniqueArray.splice(myUniqueArray.indexOf(obj.senderid),1);
			if(myUniqueArray.length>0){
				connection.query('select `id`,`name`,`photo`,`userstatus`,`device_id` from `employee` where `del`=0 AND `id` IN ('+myUniqueArray+')', function (err, rows1, fields){
					rows1.forEach(function(row1, index1) {
						connection.query('select * from `chat_demo` where `rcv_id`="'+row1.id+'" AND `send_id`="'+obj.senderid+'"  AND `uid` NOT IN ('+del+' ) UNION select * from `chat_demo` where `send_id`="'+row1.id+'" AND `rcv_id`="'+obj.senderid+'"  AND `uid` NOT IN ('+del+') ORDER BY `id` DESC LIMIT 1', function (err, rows2, fields1){
if(rows2.length>0){ 								var sndMsg = {
									id : row1.id,
									name : row1.name,
chattype:'indivisual',		
							photo : row1.photo,
															dtype : rows2[0].type,
									
                                    message : rows2[0].message,
deviceid : row1.device_id,
									datetime : rows2[0].datetime,
									userstatus : row1.userstatus
								}
                                
                                
//sendnoti(row1.device_id,'You Got a Message')    ;                            
                                





								arr1.push(sndMsg);
							console.log(sndMsg);                         
                             socket.emit('chatEmployeeList',{result :arr1});

}		
				}); 
					});
				});
			}
		});
});



                            		connection.query('select `u_g` from `employee` where `id`="'+obj.senderid+'"', function (err, rows, fields){
			rows.forEach(function(row, index) {
				ary = row.u_g;
				//arr.push(row.rcv_id);
			});

				connection.query('select `id`,`uid`,`name`,`photo`,`userstatus`,`num`,`admin` from `e_group` where `del`=0 AND `id` IN ('+ary+')', function (err, rows1, fields){
if(rows1.length>0)
					rows1.forEach(function(row1, index1) {


						connection.query('select `message`,`type`,`datetime`,`uid` from `group_chat` where `rcv_id`="'+row1.id+'" AND `uid` NOT IN ('+del+' )  order by `id` DESC LIMIT 1', function (err, rows2, fields1){
			if(rows2.length>0){	
                var sndMsg1 = {
									id : row1.id,
									name : row1.name,
chattype:'group',
admin:row1.admin,
description :row1.uid,
deviceid : '123',
									photo : row1.photo,
									path : 'http://192.168.0.158:90/indiracrm//assets/admin/images/profile/',
									dtype : rows2[0].type,
						                           message : rows2[0].message,
									datetime : rows2[0].datetime,
									userstatus : row1.userstatus
								}
                   
                                
								arr1.push(sndMsg1);
}
console.log(arr1);
 socket.emit('chatEmployeeList',{result :arr1});

                        			}); 
// socket.emit('chatEmployeeList',{result :arr1});
					});
				});
			
});
 
 //       								socket.emit('chatEmployeeList',{result :arr1});
// socket.emit('chatEmployeeList',{result :arr1});
console.log({result : arr1});
    });


    socket.on('sendMessage', function(myMessage){
        var obj = JSON.parse(myMessage);
console.log(obj);
	    if (clients[obj.reciverid]){
            connection.query('select `window_status`,`device_id` from `employee` WHERE id = '+obj.reciverid, function (err, rows, fields){
                if(JSON.parse(rows[0].window_status)){
                    connection.query('insert into chat_demo(`send_id`,`rcv_id`,`datetime`,`message`,`isread`,`deliver`,`type`,`uid`) value("'+obj.senderid+'","'+obj.reciverid+'","'+obj.datetime+'","'+obj.message+'","'+true+'","'+true+'","'+obj.dtype+'","'+obj.uid+'")', function (err, rows, fields){});

senderNo.pushSingle({
    channel_id: rows[0].device_id,
    msg_type: 1,
    msg: JSON.stringify({title: obj.sname,description: JSON.stringify({obj})})
}).then(function (data) {
    console.log(data);
}).catch(function (err) {
    console.log(err);
});

					
			var sndMsg = {
				reciverid : obj.reciverid,
	message : obj.message,
								uid:obj.uid,
		
                dtype : obj.dtype,
				senderid : obj.senderid,
				datetime : obj.datetime,
				isread : obj.isread,
				deliver : obj.deliver,
				response : "read"
			}
			socket.emit('mySendMessage', sndMsg);
console.log("online");
  
              }else{
notificationsend("indivisual",obj);
var sndMsg = {
				reciverid : obj.reciverid,
				message : obj.message,
				dtype : obj.dtype,
							uid:obj.uid,

                senderid : obj.senderid,
				datetime : obj.datetime,
				isread : obj.isread,
				deliver : obj.deliver,
				response : "delivered"
			}
			socket.emit('mySendMessage', sndMsg);
			
connection.query('insert into chat_demo(`send_id`,`rcv_id`,`datetime`,`message`,`isread`,`deliver`,`type`,`uid`) value("'+obj.senderid+'","'+obj.reciverid+'","'+obj.datetime+'","'+obj.message+'","'+false+'","'+true+'","'+obj.dtype+'","'+obj.uid+'")', function (err, rows, fields){});
			

		connection.query('update `chat_demo` set `isread`="'+false+'",`deliver`="'+true+'" where `send_id`="'+obj.senderid+'" AND `rcv_id`="'+obj.reciverid+'" AND `isread`!="'+true+'" OR `send_id`="'+obj.reciverid+'" AND `rcv_id`="'+obj.senderid+'" AND `isread`!="'+true+'"', function (err, rows, fields){});
                }
            });
//socket.join("room-")
            io.sockets.connected[clients[obj.reciverid].socket].emit('recieveMessage', obj);
        } else {
  notificationsend("indivisual",obj);

		var sndMsg = {
			reciverid : obj.reciverid,
			dtype : obj.dtype,
			uid:obj.uid,
            message : obj.message,
			senderid : obj.senderid,
			datetime : obj.datetime,
			isread : obj.isread,
			deliver : obj.deliver,
			response : "not avilable"
		}
		socket.emit('mySendMessage', sndMsg);
            connection.query('UPDATE employee SET `window_status` = "false" WHERE id = '+obj.reciverid, function (err, rows, fields){});
            connection.query('insert into chat_demo(`send_id`,`rcv_id`,`datetime`,`message`,`isread`,`deliver`,`type`,`uid`) value("'+obj.senderid+'","'+obj.reciverid+'","'+obj.datetime+'","'+obj.message+'","'+false+'","'+false+'","'+obj.dtype+'","'+obj.uid+'")', function (err, rows, fields){});
        }
    });



  socket.on('sendMessageGroup', function(myMessage){
 //  socket.join("room-"+roomno);

        var obj = JSON.parse(myMessage);
   socket.join(obj.reciverid);	   
console.log(socket.rooms);
console.log(obj);
   notificationsendgrp(obj);

 if (clients[obj.reciverid]){
      socket.join(obj.reciverid);

         
                    connection.query('insert into group_chat(`send_id`,`rcv_id`,`datetime`,`message`,`isread`,`deliver`,`type`) value("'+obj.senderid+'","'+obj.reciverid+'","'+obj.datetime+'","'+obj.message+'","'+true+'","'+true+'","'+obj.dtype+'","'+obj.uid+'")', function (err, rows, fields){});
					
			var sndMsg = {
				reciverid : obj.reciverid,
	message : obj.message,
							
                dtype : obj.dtype,
				senderid : obj.senderid,
				datetime : obj.datetime,
				isread : obj.isread,
			uid : obj.uid,

				deliver : obj.deliver,
				response : "read"
			}
            notificationsendgrp(obj);

			socket.emit('mySendMessage', sndMsg);
connection.query('update `group_chat` set `isread`="'+true+'",`deliver`="'+true+'" where `send_id`="'+obj.senderid+'" AND `rcv_id`="'+obj.reciverid+'" OR `send_id`="'+obj.reciverid+'" AND `rcv_id`="'+obj.senderid+'"', function (err, rows, fields){});

                
			
         //io.sockets.connected[clients['2'].socket].emit('recieveMessage', obj);
console.log("TESTT");
        } else {
		var sndMsg = {
			reciverid : obj.reciverid,
			dtype : obj.dtype,
			uid : obj.uid,
			
            message : obj.message,
			senderid : obj.senderid,
			datetime : obj.datetime,
			isread : obj.isread,
			deliver : obj.deliver,
			response : "not avilable"
		}
		socket.emit('mySendMessage', sndMsg);
            
     io.sockets.in(obj.reciverid).emit('recieveMessage', obj);
console.log(obj);
//  io.sockets.connected[clients['1'].socket].emit('recieveMessage', sndMsg);           
 connection.query('UPDATE employee SET `window_status` = "false" WHERE id = '+obj.reciverid, function (err, rows, fields){});
            connection.query('insert into group_chat(`send_id`,`rcv_id`,`datetime`,`message`,`isread`,`deliver`,`type`,`uid`) value("'+obj.senderid+'","'+obj.reciverid+'","'+obj.datetime+'","'+obj.message+'","'+false+'","'+false+'","'+obj.dtype+'","'+obj.uid+'")', function (err, rows, fields){});
                    
notificationsendgrp(obj);

        }
    });
   
    
    socket.on('disconnect', function() {
	var abc = [];
        for(var name in clients) {
            if(clients[name].socket === socket.id) {
                connection.query('UPDATE employee SET `window_status` = "false" WHERE id = '+name, function (err, rows, fields){});
                delete clients[name];
                break;
            }
        }
	for(var name in clients) {
		abc.push(clients[name]);
        }   
	io.emit('userOffline', {myId : abc});
    })
});

http.listen(port, function(){
   console.log('server listening on port : ', port);
});
