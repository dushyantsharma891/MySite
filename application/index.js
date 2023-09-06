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

const 
    chat_socket         = require('./chat'),
    live_socket         = require('./live'),
    common_socket       = require('./common'),
    helper              = require('../common/helper/'),
    common_controller   = require('./application/controllers/common'),
    socket_constant     = require('../common/config/socket_constant'),
    constant_listener   = socket_constant.LISTENER,
    constant_emit       = socket_constant.EMIT,
    socketHandlerObj    = {};

socketHandlerObj.onSocketConnect = function(socket){

    socket.on(constant_listener.MAIN_LISTENER, async function (dataObj) {
        //helper.logs({'ON CALL LISTENER======' : dataObj});
        //if ( dataObj && dataObj.type.meeting && dataObj.type.meeting != "CANDIDATE") {
            console.log('ON LISTENER======' , dataObj);
        //}
        if ( dataObj && dataObj.data ) {

            let userAthuntication = helper.isAuthentication( socket , dataObj);
            
            if ( userAthuntication && userAthuntication.userId && userAthuntication.u_uuid ) {

                console.log('We are hear ===================>>>>>>>');
                if ( dataObj.data ) {
                    // console.log('ON 345678796544356789876543456789807654334567897654' , userAthuntication);
                   dataObj.data.userId     = userAthuntication.userId;
                   dataObj.data.userUuid   = userAthuntication.u_uuid;
                   dataObj.data.mySocketId = socket.id;
                }
                if ( dataObj.type ) {
                    let type = dataObj.type;

                    if ( type.chat ) {
                        console.log('We are hear ===================>>>>>>>,type.chat',type.chat);
                        chat_socket.init(socket , dataObj);
                    }
                   
                }
            } else {
                socket.emit(constant_emit.MAIN_EMIT,{
                    action : 'INFO',
                    data : {
                        message: 'Authentication failed!'
                    }
                })
            }
        } else {
            console.log('ON error part======' );
            socket.emit(constant_emit.MAIN_EMIT,{
                action : 'ERROR',
                data : {
                    message: '2222222222222222222'
                }
            })
        }
    });


    socket.on('live', async function (dataObj){
        console.log('ON LIVE LISTENER======' , dataObj);
        if ( dataObj && dataObj.data ) {
            let userAthuntication = helper.isAuthentication( socket , dataObj.data);
            if ( userAthuntication && userAthuntication.userId && userAthuntication.u_uuid ) {
                if ( dataObj.data ) {
                   dataObj.data.userId = userAthuntication.userId;
                   dataObj.data.userUuid = userAthuntication.u_uuid;
                   dataObj.data.mySocketId = socket.id;
                }
                if ( dataObj.type ) {
                    let type = dataObj.type;
                    if ( type.contestLive ) {
                        live_socket.init(socket , dataObj);
                    }
                    // if ( type.timeLine ) {
                    //     time_line_socket.init(socket , dataObj);
                    // }
                }
            } else {
                socket.emit(constant_emit.MAIN_EMIT_LIVE,{
                    action : 'INFO',
                    data : {
                        message: 'Authentication failed!'
                    }
                })
                // socket.emit('live',{
                //     action : 'INFO',
                //     data : {
                //         message: 'Authentication failed!'
                //     }
                // })
            }
        } else {
            socket.emit(constant_emit.MAIN_EMIT_LIVE,{
                action : 'ERROR',
                data : {
                    message: '2222222222222222222'
                }
            })
            // socket.emit('live',{
            //     action : 'ERROR',
            //     data : {
            //         message: '2222222222222222222'
            //     }
            // })
        }
    })


    common_socket.init(socket);
}



module.exports.init = function (io) {
    console.log('first------>>>>');
   
    io.on('connection', function (socket) {
        console.log('new Connect ' );
        let userAthuntication = helper.isAuthentication( socket );
        if ( userAthuntication && userAthuntication.u_uuid ) {
            // console.log('new Connect TOKEN---------------------------------------------------- ', userAthuntication);
            common_controller.newUser(socket , userAthuntication);
        }
        socketHandlerObj.onSocketConnect(socket);
	});

	
}
