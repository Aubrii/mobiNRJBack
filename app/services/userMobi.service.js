const config = require('../db.config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../_helpers/db');
const fs = require("fs");
 // const userController = require('../controllers/user.controller')
// const mobiService = require('mobi.service')


module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    addMobiToUser
};



async function getAll() {
    return await db.UserMobi.findAll({

    });
}


async function getById(id) {
    return await getUserMobi(id);
}

async function addMobiToUser(UserId, params){
    const mobi = await db.Mobi.findByPk(params.MobiId);
    const user = await db.User.findByPk(UserId)
    const userMobiExist = await db.UserMobi.findAll({
        where:{
            MobiId : mobi.id,
            UserId: user.id
        }
    })
    console.log(userMobiExist)
    if(userMobiExist.length){
        throw 'Cet utilisateur est deja affilié a ce mobiNRJ';
        return;
    }
    if (!mobi || !user) {
        throw 'Mobi or User not found';
        return;
    }else{
    console.log("params user service : ", params);
    params.UserId = UserId;
    const userMobi = new db.UserMobi(params)
    await userMobi.save();
    console.log("mobi id",userMobi.MobiId)
    }
}



async function create(mobiInfo) {
    // Valider les entrées de l'utilisateur
    // ...

    // Vérifier si un utilisateur avec la même adresse e-mail existe déjà
    const existingMobi = await db.UserMobi.findOne({ where: { name: mobiInfo.name } });
    if (existingMobi) {
        throw new Error(`Un mobiNRJ avec le nom : ${mobiInfo.name} existe déjà`);
    }

    const userMobi = new db.UserMobi(mobiInfo);

    // save client
    await userMobi.save();

    // Ajouter la relation avec l'entreprise
    //await user.addEntreprise(userInfo.EntrepriseId);
}


async function update(id, params) {
    const userMobi = await getUserMobi(id);
//TODO: VOIR LA METHODE POUR UPDATE
    // validate
    // const mobiNameChanged = params.name && user.name !== params.name;
    // if (mobiNameChanged && await db.UserMobi.findOne({ where: { name: params.name } })) {
    //     throw 'Mobi name "' + params.name + '" is already taken';
    // }

    // Hash du mot de passe s'il a été modifié


    // copy params to user and save
    Object.assign(userMobi, params);
    console.log(params);

    // copy params to user and save
    await userMobi.save();

}

async function _delete(id) {
    const userMobi = await getUserMobi(id);
    await userMobi.destroy();
}

// helper functions

async function getUserMobi(id) {
    const userMobi = await db.UserMobi.findByPk(id,{
    });
    if (!userMobi) throw 'User not found';
    return userMobi;
}


