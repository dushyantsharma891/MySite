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
const chat_controller   = require('./application/controllers/chat'),
      socket_constant   = require('../common/config/socket_constant'),
      constant_emit     = socket_constant.EMIT;
let obj = {};

obj.init = function(socket , dataObj){
    
    if ( dataObj && dataObj.type && dataObj.data && dataObj.type.chat) {
        switch( dataObj.type.chat ) {
            // case 'MESSAGE':
            //     onMessage( socket, dataObj.data );   
            //     break;
            case 'CON-MESSAGE':
                console.log('We are hear ===================>>>>>>>CON-MESSAGE');
                obj.conChatMessage(socket, dataObj.data);
                break;
            case 'CON-ROOM-JOIN-LEAVE':
                console.log('We are hear ===================>>>>>>>CON-ROOM-JOIN-LEAVE');
                obj.conRoomJoinLeave(socket, dataObj.data);
                break;
            case 'PRIVATE-MESSAGE':
                console.log('We are hear ===================>>>>>>>PRIVATE-MESSAGE');
                obj.conPrivateChatMessage(socket, dataObj.data);
                break;
            case 'TYPING-MESSAGE':
                console.log('We are hear ===================>>>>>>>TYPING-MESSAGE');
                obj.conTypingMessage(socket, dataObj.data);
                break;
            case  'SEND-NOTIFICATION-COUNT':
                console.log('UPDATE-TOTAL-EARNING=======>>>>>>>>>>>>>>> QUE-ANS-MESSAGE',dataObj.data)
                obj.sendNotificationCount( socket, dataObj.data );   
                break; 
                

            // case 'CHAT-ROOM-JOIN-LEAVE':
            //     obj.chatRoomJoinLeave(socket, dataObj.data);
            //     break;
            // case 'HISTORY':
            //     onHistory( socket, dataObj.data );   
            //     break; 
            // case 'SEEN-CHAT':
            //     onSeenChat( socket, dataObj.data ); 
            // case 'SEEN-GROUP-CHAT':
            //     onSeenGroupChat( socket, dataObj.data );   
            //     break;
            // case 'GET-ALL-PARTICIPANTS-UNSEENCOUNT':
            //     onGetAllUnSeenChat( socket, dataObj.data );   
            //     break;
            // case 'GROUP-CHAT-ENABLE-DISABLE':
            //     onChatEnableDisable( socket, dataObj.data );   
            //     break;
            default:
                socket.emit(constant_emit.MAIN_EMIT,{
                    action : 'ERROR'
                })
        }
    } else {
        socket.emit(constant_emit.MAIN_EMIT,{
            action : 'ERROR'
        })
    }
}


/**
 * 
 * @param: 
 * @returns:
 * @developer :   
 */
 obj.conRoomJoinLeave = async function(socket, data) {
    let res = await chat_controller.conRoomJoinLeave(socket, data);
    send(socket, res);
}


/**
 * 
 * @param: 
 * @returns:
 * @developer :   
 */
 obj.conChatMessage = async function(socket, data) {
    let res = await chat_controller.oneToOneMessage(socket, data);
    send(socket, res);
    // let resOne = await chat_controller.newMessageReceive( data);
    // send(socket, resOne );
}


/**
 * 
 * @param: 
 * @returns:
 * @developer :   
 */
obj.conPrivateChatMessage = async function(socket, data) {
    let res = await chat_controller.conPrivateChatMessage(socket, data);
    send(socket, res);
    // let resOne = await chat_controller.newMessageReceive( data);
    // send(socket, resOne );
}

/**
 * 
 * @param: 
 * @returns:
 * @developer :   
 */
obj.conTypingMessage = async function(socket, data) {
    let res = await chat_controller.conTypingMessage(socket, data);
    send(socket, res);
    // let resOne = await chat_controller.newMessageReceive( data);
    // send(socket, resOne );
}

/**
 * 
 * @param: 
 * @returns:
 * @developer :   
 */
obj.sendNotificationCount = async function(socket, data) {
    let res = await chat_controller.sendNotificationCount(socket, data);
    send(socket, res);
    // let resOne = await chat_controller.newMessageReceive( data);
    // send(socket, resOne );
}

/**
 * 
 * @param: 
 * @returns:
 * @developer : 
 */

function send(socketObj, data ) {
    let socket = (socketObj && socketObj != '') ? socketObj : io;

    if ( socket ) {

        if ( data && data.to && data.to.length > 0 && data.emit ) {
            if (  data.emit.action != 'CANDIDATE') {
                //console.log( 'CHAT EMIT=====TO other' , data.emit );
            }
            if ( data.own ) {
                socket.emit(constant_emit.MAIN_EMIT, data.emit );
            }
            data.to.forEach(function( row ) {
                socket.to(row.uc_socket_id).emit(constant_emit.MAIN_EMIT , data.emit);

            });

        } else if (data && data.emit ) {
            //console.log( 'CHAT EMIT=====TO own' , data.emit );
            socket.emit(constant_emit.MAIN_EMIT, data.emit );

        } else {

            socket.emit(constant_emit.MAIN_EMIT, {
                action: 'INFO',
                data: {
                    message: 'Something went wrong!'
                }
            });
        }
    }
}



// /**
//  * 
//  * @param: 
//  * @returns:
//  * @developer :  
//  */
// async function onMessage( socket, data ) {
//     let res = await chat_controller.onMessage( data );
//     if ( res ) {
//         send(socket, res );
//     } 
// }





// /**
//  * 
//  * @param: 
//  * @returns:
//  * @developer :  
//  */
// async function onChatEnableDisable( socket, data ) {
//     let res = await chat_controller.onChatEnableDisable( data );
//     send(socket, res );

// }

// /**
//  * 
//  * @param: 
//  * @returns:
//  * @developer :  
//  */
// async function onSeenChat( socket, data ) {
//     let res = await chat_controller.onSeenChat( data );
//     send(socket, res );

// }

// /**
//  * 
//  * @param: 
//  * @returns:
//  * @developer :  
//  */
// async function onGetAllUnSeenChat( socket, data ) {
//     let res = await chat_controller.onGetAllUnSeenChat( data );
//     send(socket, res );

// }

// /**
//  * 
//  * @param: 
//  * @returns:
//  * @developer :  
//  */
// async function onSeenGroupChat( socket, data ) {
//     let res = await chat_controller.onSeenGroupChat( data );
//     send(socket, res );

// }

// /**
//  * 
//  * @param: 
//  * @returns:
//  * @developer :  
//  */
// async function onHistory( socket, data ) {
//     let res = await chat_controller.onHistory( data );
//     send(socket, res );

// }

module.exports = obj;