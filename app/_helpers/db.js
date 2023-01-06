const config = require('../db.config.json');
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');
module.exports = db = {};

initialize();

async function initialize() {
    // create db if it doesn't already exist
    const { host, port, user, password, database } = config.database;
    const connection = await mysql.createConnection({ host, port, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

    // connect to db
    const sequelize = new Sequelize(database, user, password, { dialect: 'mysql' });

    //
    // sequelize.sync({ force: true }).then(() => {
    //     console.log("Suppression et synchronisation des tables.");
    // });

    // init models and add them to the exported db object
    db.User = require('../models/user.model')(sequelize);
    db.Mobi = require('../models/mobi.model')(sequelize);
    db.UserMobi = require('../models/userMobi.model')(sequelize);
    db.Log = require('../models/log.model')(sequelize);
    db.Localisation = require('../models/localisation.model')(sequelize);

    db.User.belongsToMany(db.Mobi, {through: db.UserMobi});
    db.Mobi.belongsToMany(db.User, {through: db.UserMobi});

    db.User.belongsTo(db.Localisation)
    db.Mobi.belongsTo(db.Localisation)


    // sync all models with database

    await sequelize.sync({ alter: true });
}
