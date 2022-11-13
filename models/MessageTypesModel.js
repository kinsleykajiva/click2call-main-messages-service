

const {Model, DataTypes, Sequelize} = require("sequelize");
const sequelizeDB = require("../config/database");
const moment = require('moment-timezone');




class messageTypesModel extends Model {}

messageTypesModel.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.TEXT,
        allowNull: true,

    }
}, {

    sequelize: sequelizeDB,

    tableName: 'messageTypes'
});


module.exports = {messageTypesModel};
