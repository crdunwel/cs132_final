var Sequelize = require("sequelize");

var sequelize = new Sequelize('database', null, null,
    {
        // the sql dialect of the database
        dialect: 'sqlite',
        // the storage engine for sqlite - default ':memory:'
        storage: './chatroom.db'
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