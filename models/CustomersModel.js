

const {Model, DataTypes, Sequelize} = require("sequelize");
const sequelizeDB = require("../config/database");
const moment = require('moment-timezone');




class CustomersModel extends Model {}

CustomersModel.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    fullName: {
        type: DataTypes.TEXT,
        allowNull: true,

    },
    phoneNumber: {
        type: DataTypes.TEXT,
        allowNull: true,

    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true,

    },
    companyId: {
        type: DataTypes.INTEGER,
        allowNull: false,

    },
    unifierId: {
        type: DataTypes.TEXT,
        allowNull: true,

    },
    email: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null

    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null

    },
    isCustomer: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false

    },
    dateCreated: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: moment.utc().format('YYYY-MM-DD HH:mm:ss'),

    },
}, {

    sequelize: sequelizeDB,

    tableName: 'customers'
});


module.exports = {CustomersModel};
