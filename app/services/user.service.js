const config = require('../../db.config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../_helpers/db');
const fs = require("fs");
let currentUserId = null;


module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete,
};


async function authenticate({ email, password }) {
    const user = await db.User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password)))
        throw 'Username or password is incorrect';

    // authentication successful
    const token = jwt.sign({sub:user}, config.secret, { expiresIn: '7d' });
    console.log("console log de l'utilisateur authentifier",user)
    currentUserId = user.getDataValue('id');
    console.log("utilisateur courant : ", currentUserId)
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
    const existingUser = await db.User.findOne({ where: { email: userInfo.email } });
    if (existingUser) {
        throw new Error(`Un utilisateur avec l'adresse e-mail ${userInfo.email} existe déjà`);
    }else{
        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(userInfo.password, 10);
        userInfo.password = hashedPassword;
        const user = new db.User(userInfo);
        await user.save();
        const admin = await db.User.findByPk(currentUserId)
        const log = new db.Log({
           history : `L'administateur ${admin.firstName} (id: ${admin.id}) à créer l'utilisateur nommé: ${user.firstName}, email: ${user.email} (id: ${user.id})`
    })
        await log.save();
    }


}




async function update(id, params) {
    const user = await getUser(id);
//TODO: VOIR LA METHODE POUR UPDATE
    // validate
    console.log("console de l'utilisateur ", user)
    console.log("console des params ", params)
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
    const log = new db.Log({
        history : `L'utilisateur ${user.firstName} (id: ${user.id}) à modifié son profil.
        Anciennes valeurs: ${user.firstName}, ${user.lastName}, ${user.email},
        Nouvelles valeurs: ${params.firstName}, ${params.lastName}, ${params.email}`
    })
    // copy params to user and save
    Object.assign(user, params);
    console.log(params);

    // copy params to user and save

    await user.save();
    await log.save();

    return omitHash(user.get());
}


async function _delete(id) {
    const user = await getUser(id);
    await user.destroy();
    const admin = await db.User.findByPk(currentUserId)
    const log = new db.Log({
        history : `L'administateur ${admin.firstName} (id: ${admin.id}) à supprimé l'utilisateur nommé: ${user.firstName}, email: ${user.email} (id: ${user.id})`
    })
    await log.save();
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

