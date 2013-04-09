/**
 * Example file for how to define our models.
 * Check out http://www.sequelizejs.com/ for more advanced
 * functionality
 */

var Sequelize = require("sequelize");

var sequelize = new Sequelize('database', null, null,
    {
        // the sql dialect of the database
        dialect: 'sqlite',
        // the storage engine for sqlite - default ':memory:'
        storage: './temp.db'
    });

var Message = sequelize.define('Message',
    {
        room: Sequelize.STRING,
        nickname: Sequelize.STRING,
        body:Sequelize.TEXT
    }
);

sequelize.sync({force: true});
exports.Message = Message;