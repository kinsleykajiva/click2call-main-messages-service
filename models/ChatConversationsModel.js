const {Model, DataTypes, Sequelize} = require("sequelize");
const sequelizeDB = require("../config/database");
const moment = require('moment-timezone');




class ChatConversationsModel extends Model {}

ChatConversationsModel.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    senderId: {
        type: DataTypes.INTEGER,
        allowNull: false,

    },
    messageTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,

    },
    ticketId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,

    },
    content: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: false

    },
    mergeId: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: false

    },
    recipientId: {
        type: DataTypes.INTEGER,
        allowNull: false,

    },
    hasRead: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false

    }, isAgent: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false

    },
    dateCreated: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: moment.utc().format('YYYY-MM-DD HH:mm:ss'),

    },
}, {

    sequelize: sequelizeDB,

    tableName: 'chat-conversations'
});


module.exports = {ChatConversationsModel};
