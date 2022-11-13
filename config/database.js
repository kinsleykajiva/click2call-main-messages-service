const { Sequelize } = require( "sequelize" );

const mysql = require('mysql2/promise');
require('dotenv').config();

module.exports.DATABASE = mysql.createPool({
    "host": process.env.DB_HOST,
    "user": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "port": process.env.DB_PORT
});
const params = {
    host: process.env.DB_HOST ,
    user: process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};
 const sequelizeDB = new Sequelize(params.database, params.user, params.password, {
    host: params.host,
    dialect: 'mariadb',
    define: {
        timestamps: false
    }
});
module.exports = sequelizeDB;