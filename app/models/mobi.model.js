const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        name: { type: DataTypes.STRING, allowNull: false },
        quantityMax: { type: DataTypes.INTEGER, allowNull: false },
    };


    return sequelize.define('Mobi', attributes);

}

