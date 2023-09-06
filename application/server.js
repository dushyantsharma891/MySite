
/**
 * Copyright (C) A Cube Technologies - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential. Dissemination of this information or reproduction 
 * of this material is strictly forbidden unless prior written permission is obtained
 * from A Cube Technologies.
--[[
              _____      _            _______        _                 _             _           
     /\      / ____|    | |          |__   __|      | |               | |           (_)          
    /  \    | |    _   _| |__   ___     | | ___  ___| |__  _ __   ___ | | ___   __ _ _  ___  ___ 
   / /\ \   | |   | | | | '_ \ / _ \    | |/ _ \/ __| '_ \| '_ \ / _ \| |/ _ \ / _` | |/ _ \/ __|
  / ____ \  | |___| |_| | |_) |  __/    | |  __/ (__| | | | | | | (_) | | (_) | (_| | |  __/\__ \
 /_/    \_\  \_____\__,_|_.__/ \___|    |_|\___|\___|_| |_|_| |_|\___/|_|\___/ \__, |_|\___||___/
                                                                                __/ |            
                                                                               |___/             
--]]                                                                                                                                                                                                                                                                                                                    
 * Written By  : 
 * Description :
 * Modified By :
 */

/* #################################
	Project		 : GlimpstersAps
	Module		 : Node Server
    Created		 : 2021-11-14
	Developed By : Anil Guleria 
    Description	 : Server configuration file.
*/
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "1";

const express			= require('express'),
    http 				= require('http'),
    cookieParser	    = require('cookie-parser'),
    helmet			    = require('helmet'),
    bodyParser 		    = require('body-parser'),
    nocache             = require('nocache'),
    jwt		            = require('jsonwebtoken'),
    fs		            = require('fs');
    // redis 		        = require('socket.io-redis');
    
    router		        = require('./application/routes/index');
    const config		= require('./common/config').init();

    const socketObj 	= require('./connect');
   

const app 	            = express();

global.app = app;       
global.jwt = jwt;

app.set('port', process.env.PORT || 3000);
app.set('superSecret', config.secret);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.use('/uploads', express.static('uploads'));
app.use(express.static(__dirname + 'uploads'));

app.use(cookieParser());
	app.use(nocache());


let server = http.createServer(app);
const socketio          = require("socket.io")(server, {
	pingInterval: 1000, // how often to ping/pong.
	pingTimeout: 2000 // time after which the connection is considered timed-out.
});

// const socketio          = require("socket.io");

const io    = socketio.listen(app.listen(app.get('port')));

global.io   = io;

router.init( app, '' , '' , '' );

socketObj.init(io);

// io.on('connection', function (socket) {
//     console.log("new user connected !" , socket.id);
	
// 	socket.on('call',function(data){
// 		socket.emit('call', {socket_id :  socket.id});
// 		console.log("calll",data)
// 	}) 

// 	socket.on('data',function(data){
// 		socket.emit('init', {socket_id :  socket.id});
// 		console.log("dataaa",data)
// 	})
// 	socket.on('disconnect', async function (channel) {
// 		console.log("disconnect ------>>",socket.id)
// 	});
	
// });











