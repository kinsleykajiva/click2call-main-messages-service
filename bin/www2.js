#!/usr/bin/env node

var app = require('../app');
var debug = require('debug')('main-messeges-service:server');
var http = require('http');
var url = require('url');

const sequelizeDB = require("../config/database");
const {winston, logger} = require("../utils/loggerUtls");

const moment = require("moment-timezone");

const {ChatConversationsModel} = require("../models/ChatConversationsModel");
const {PendingIncomingsModel} = require("../models/PendingIncomingsModel");
const {userJoin, getCurrentUser, userLeave, getRoomUsers, userJoinCompanyParentGroup} = require('../utils/utildUsers');
require('dotenv').config();
let io = require('socket.io')(http, {cors: {origin: '*'}});

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT);
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

let messages = [];
let connectionSet = [];
io.listen(port);
io.on('connection', socket => {
    console.log('a user connected');
    console.log(socket.handshake.query['key']);
    connectionSet.push(socket);
    socket.on('SUB', (message) => {

        if (message.admin) {
            message.session.admin = message.admin;
        }

        console.log('info', 'XXXX-', message)
        logger.error('XXXX-message ', message + "");
        userJoinCompanyParentGroup(socket.id, message.session, message.WIDGET_API_KEY, message.withSocketChatRoom);
        const WIDGET_API_KEY = message.WIDGET_API_KEY;
        const withSocketChatRoom = message.withSocketChatRoom;
        const messageObj = {
            method: message.method,
            payload: {
                currentUsersOnline: getRoomUsers(message.withSocketChatRoom),
                user: {
                    userId: message.session.id,
                    messages: messages,
                }
            }
        }


        socket.join(withSocketChatRoom);
        socket.join(WIDGET_API_KEY);
        // Broadcast when a user connects
        socket.broadcast.to(withSocketChatRoom).emit('SUB', messageObj);
        socket.broadcast.to(WIDGET_API_KEY).emit('SUB_AGENTS', messageObj);

    });

    socket.on('SCREEN_SHARE_INVITE', message => {
        console.log('user SCREEN_SHARE_INVITE');


    });

    socket.on('CLOSE_EXIT', message => {
        console.log('user SCREEN_SHARE_INVITE');


    });

    socket.on('CALL_ACCEPTED', message => {
        console.log('user CALL_ACCEPTED');


    });

    socket.on('CALL_REJECTED', message => {
        console.log('user CALL_REJECTED');


    });

    socket.on('ENDED_CALL', message => {
        console.log('user ENDED_CALL');


    });

    socket.on('RING_RING', message => {
        console.log('user RING_RING');


    });

    socket.on('MESSAGE', message => {
        console.log('user MESSAGE');


    });

    socket.on('ACCEPT', message => {
        console.log('user ACCEPT');


    });


    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

});


const updateCustomerIncomingMessageWebsiteCompanyOnline_ = async (senderId, handledByUserId) => {
    let handledByDateTime = moment.utc().format('YYYY-MM-DD HH:mm:ss');
    return PendingIncomingsModel.update({
        senderId, handledByUserId, handledByDateTime
    }, {where: {senderId, handledByUserId: 0}})
}
const saveCustomerIncomingMessageWebsiteCompanyOnline_ = async (senderId, companyId, handledByUserId, content) => {
    handledByUserId = handledByUserId || 0;

    return PendingIncomingsModel.create({
        senderId, companyId, handledByUserId, content
    })
}

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}


/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            logger.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            logger.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}


/**
 * Event listener for HTTP server "listening" event.
 */

async function onListening() {

    try {
        await sequelizeDB.authenticate();
        logger.log('info', 'Connection has been established successfully.');

        console.log('Connection has been established successfully.');

    } catch (error) {
        console.error('Unable to connect to the database:', error);
        logger.error('error', 'Unable to connect to the database:', error);
    }
    console.log()

    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}

process.on('exit', function () {
    console.log('Your process is exiting');
    logger.error('Your process is exiting');
});








