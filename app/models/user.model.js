const { DataTypes } = require('sequelize');
const Joi = require("joi");

module.exports = model;

function model(sequelize) {
    const attributes = {
        firstName: { type: DataTypes.STRING,allowNull:true},
        lastName: { type: DataTypes.STRING, allowNull: false },
        role: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false },
        password: { type: DataTypes.STRING, allowNull: false },
        avatarUrl: {type: DataTypes.STRING, },
        lastLogin:{type: DataTypes.DATE},

    };

    const options = {

        scopes: {
            // include hash with this scope
            withHash: { attributes: {}, }
        }
    };

    return sequelize.define('User', attributes, options);

}

