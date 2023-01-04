const config = require('../db.config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../_helpers/db');
const fs = require("fs");


module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    addMobiToUser
};

async function addMobiToUser(userID, params){
    typeof params;
    console.log("params user service : ", params)
    const user = await db.User.findByPk(userID);
    await user.addMobi(params.MobiId, params.quantityAutorize, params.quantityGet)

}


async function authenticate({ email, password }) {
    const user = await db.User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password)))
        throw 'Username or password is incorrect';

    // authentication successful
    const token = jwt.sign({sub:user}, config.secret, { expiresIn: '7d' });
    return { ...omitHash(user.get()), token };
}

async function getAll() {
    return await db.User.findAll({
        include:[db.Mobi]
    });
}


async function getById(id) {
    return await getUser(id);
}

async function create(userInfo) {
    // Valider les entrées de l'utilisateur
    // ...

    // Vérifier si un utilisateur avec la même adresse e-mail existe déjà
    const existingUser = await db.User.findOne({ where: { email: userInfo.email } });
    if (existingUser) {
        throw new Error(`Un utilisateur avec l'adresse e-mail ${userInfo.email} existe déjà`);
    }

    // Hasher le mot de passe
    userInfo.password = await bcrypt.hash(userInfo.password, 10);

    // // Lire l'image téléchargée par l'utilisateur et la convertir en données binaires
    // const avatar = await fs.promises.readFile(userInfo.avatarUrl);
    // console.log(avatar)
    // console.log(userInfo.avatarUrl)

    // Créer l'utilisateur dans la base de données


    const user = new db.User(userInfo);

    // save client
    await user.save();
    // Ajouter la relation avec l'entreprise
    //await user.addEntreprise(userInfo.EntrepriseId);



}




async function update(id, params) {
    const user = await getUser(id);
//TODO: VOIR LA METHODE POUR UPDATE
    // validate
    const usernameChanged = params.email && user.email !== params.email;
    if (usernameChanged && await db.User.findOne({ where: { email: params.email } })) {
        throw 'Username "' + params.email + '" is already taken';
    }

    // Hash du mot de passe s'il a été modifié
    if (params.password && params.password !== user.password) {
        params.password = await bcrypt.hash(params.password, 10);
    } else {
        // Copie de la valeur existante du mot de passe
        params.password = user.password;
    }


    // copy params to user and save
    Object.assign(user, params);
    console.log(params);

    // copy params to user and save
    await user.save();

    return omitHash(user.get());
}

async function _delete(id) {
    const user = await getUser(id);
    await user.destroy();
}

// helper functions

async function getUser(id) {
    const user = await db.User.findByPk(id,{
        include:[db.Mobi]
    });
    if (!user) throw 'User not found';
    return user;
}

function omitHash(user) {
    const { password, ...userWithoutHash } = user;
    return userWithoutHash;
}

