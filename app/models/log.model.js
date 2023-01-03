const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        history: { type: DataTypes.STRING, allowNull: false }
    };


    return sequelize.define('Log', attributes);

}

