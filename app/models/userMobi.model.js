const { DataTypes } = require('sequelize');
const {types} = require("joi");

module.exports = model;

function model(sequelize) {
    const attributes = {
        id : {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        UserId: {
            type: DataTypes.INTEGER
        },
        MobiId: {
            type: DataTypes.INTEGER
        },
        quantityAutorize: {
            type: DataTypes.INTEGER
        },
        quantityGet: {
            type: DataTypes.INTEGER
        }
    };

    return sequelize.define('UserMobi', attributes);
}
