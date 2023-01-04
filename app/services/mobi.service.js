const config = require('../db.config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../_helpers/db');
const fs = require("fs");


module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};



async function getAll() {
    return await db.Mobi.findAll({
        include:[db.User]
    });
}


async function getById(id) {
    return await getMobi(id);
}

async function create(mobiInfo) {
    // Valider les entrées de l'utilisateur
    // ...

    // Vérifier si un utilisateur avec la même adresse e-mail existe déjà
    const existingMobi = await db.Mobi.findOne({ where: { name: mobiInfo.name } });
    if (existingMobi) {
        throw new Error(`Un mobiNRJ avec le nom : ${mobiInfo.name} existe déjà`);
    }

    const mobi = new db.Mobi(mobiInfo);

    // save client
    await mobi.save();

    // Ajouter la relation avec l'entreprise
    //await user.addEntreprise(userInfo.EntrepriseId);
}


async function update(id, params) {
    const mobi = await getMobi(id);
//TODO: VOIR LA METHODE POUR UPDATE
    // validate
    const mobiNameChanged = params.name && user.name !== params.name;
    if (mobiNameChanged && await db.Mobi.findOne({ where: { name: params.name } })) {
        throw 'Mobi name "' + params.name + '" is already taken';
    }

    // Hash du mot de passe s'il a été modifié


    // copy params to user and save
    Object.assign(mobi, params);
    console.log(params);

    // copy params to user and save
    await mobi.save();

}

async function _delete(id) {
    const mobi = await getMobi(id);
    await mobi.destroy();
}

// helper functions

async function getMobi(id) {
    const mobi = await db.Mobi.findByPk(id,{
        include:[db.User]
    });
    if (!mobi) throw 'User not found';
    return mobi;
}


