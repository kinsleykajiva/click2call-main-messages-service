const {Model, DataTypes} = require("sequelize");
const moment = require("moment-timezone");
const sequelizeDB = require("../config/database");


class PendingIncomingsModel extends Model{

}


PendingIncomingsModel.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    senderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,

    },
    companyId: {
        type: DataTypes.INTEGER,
        allowNull: false,

    },
    handledByUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,

    },
    messageTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,

    },
    content: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: false

    },
    handledByDateTime: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null

    },
    dateCreated: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: moment.utc().format('YYYY-MM-DD HH:mm:ss'),

    },
}, {

    sequelize: sequelizeDB,

    tableName: 'pendingIncomings'
});


module.exports = {PendingIncomingsModel};