const config = require('../db.config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../_helpers/db');
const fs = require("fs");
const logService = require('./log.service');
let currentUserId = null;


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

    if (!user || !(await bcrypt.compare(password, user.password))){
        throw 'Username or password is incorrect';
    }else{
        // authentication successful
        const token = jwt.sign({sub:user}, config.secret, { expiresIn: '7d' });

        currentUserId = user.getDataValue('id');
        // console.log("utilisateur courant : ", currentUserId)
        await logService.userConnecting(user)
        const date = new Date();
        console.log(user);
        // console.log("date: ",date)
        console.log(date.toISOString())
        user.setDataValue('lastName', 'toto')
        return { ...omitHash(user.get()), token };
    }



}

async function getAll() {
    return await db.User.findAll({
        include:[db.Mobi, db.Localisation]
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
        console.log(userInfo)
        // const mobi = new db.Mobi()

        //await user.addMobi(userInfo.mobiNRJ)

        const test = new db.UserMobi({
           UserId: user.id,
           MobiId:  userInfo.mobiNRJ,
            quantityAutorize: userInfo.quantityAutorize
        })
        test.save();
        const admin = await db.User.findByPk(currentUserId)
        await logService.adminCreateUser(admin, user);


    }


}



async function updateDateConnected(email, newDateTime){
    console.log("email et newDate : ",email, newDateTime)
    const user = await db.User.findOne({
        where:{email : email}
    })
    user.updatedAt = newDateTime;
    user.save();
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
    await logService.userUpdateUser(user, params)
    // copy params to user and save
    Object.assign(user, params);
    console.log(params);

    // copy params to user and save
    await user.save();

    return omitHash(user.get());
}


async function _delete(id) {
    const user = await getUser(id);
    if(user){
        const admin = await db.User.findByPk(currentUserId)
        await logService.adminDeleteUser(admin, user)
        await user.destroy();
    }else{
        throw "L'utilisateur n'existe pas"
    }
}
// helper functions

async function getUser(id) {
    const user = await db.User.findByPk(id,{
        include:[db.Mobi, db.Localisation]
    });
    if (!user) throw 'User not found';
    return user;
}

function omitHash(user) {
    const { password, ...userWithoutHash } = user;
    return userWithoutHash;
}

