const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        latitude: { type: DataTypes.DECIMAL(10, 5) },
        longitude: { type: DataTypes.DECIMAL(10, 5) }
    };


    return sequelize.define('Localisation', attributes);

}

