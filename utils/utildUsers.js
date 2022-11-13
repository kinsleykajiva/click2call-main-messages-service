const users = [];
const companiesMap = new Map();
// Join user to chat
function userJoin(id, username, room) {
    const user = { id, username, room };

    users.push(user);

    return user;
}
// Join user to chat
// socket.id, message.session, message.WIDGET_API_KEY
function userJoinCompanyParentGroup(socketId, session, widgetApiKey,withSocketChatRoom) {
    const user = { socketId, session  ,withSocketChatRoom};// is withSocketChatRoom is null then it is customer
    if(companiesMap.has(widgetApiKey)) {
        companiesMap.get(widgetApiKey).push(user);
    } else {
        users.push(user);
        companiesMap.set(widgetApiKey, [user]);
    }
}

// Get current user
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

// User leaves chat
function userLeave(id) {
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

// Get room users
function getRoomUsers(room) {
    return users.filter(user => user.withSocketChatRoom === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers ,userJoinCompanyParentGroup
};