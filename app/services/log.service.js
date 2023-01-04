const db = require('../_helpers/db');


module.exports = {
    getAll,
    adminCreateUser,
    userUpdateUser,
    adminDeleteUser,
    userConnecting

};



async function getAll() {
    return await db.Log.findAll({});
}

async function adminCreateUser(admin, user){
    const log = new db.Log({
            history : `L'administateur ${admin.firstName} (id: ${admin.id}) à créer l'utilisateur nommé: ${user.firstName}, email: ${user.email} (id: ${user.id})`
        })
    log.save();
}
async function userUpdateUser(user, newvalue){
    const log = new db.Log({
        history : `L'utilisateur ${user.firstName} (id: ${user.id}) à modifié son profil.
        Anciennes valeurs: ${user.firstName}, ${user.lastName}, ${user.email},
        Nouvelles valeurs: ${newvalue.firstName}, ${newvalue.lastName}, ${newvalue.email}`
    })
    log.save();
}

async function adminDeleteUser(admin, user){
    const log = new db.Log({
        history : `L'administateur ${admin.firstName} (id: ${admin.id}) à supprimé l'utilisateur nommé: ${user.firstName}, email: ${user.email} (id: ${user.id})`
    })
    await log.save();
}

async function adminCreateMobi(admin, mobi){
    const log = new db.Log({
        history : `L'administateur ${admin.firstName} (id: ${admin.id}) à créer le mobiNRJ nommé: ${mobi.name}, email: ${user.email} (id: ${user.id})`
    })
    log.save();
}


async function adminDeleteMobi(admin, mobi){
    const log = new db.Log({
        history : `L'administateur ${admin.firstName} (id: ${admin.id}) à supprimé l'utilisateur nommé: ${mobi.firstName}, email: ${mobi.email} (id: ${mobi.id})`
    })
    await log.save();
}
async function userConnecting(user){
    const log = new db.Log({
        history : `L'utilisateur ${user.firstName} (id: ${user.id}) c'est authentifié avec succès)`
    })
    await log.save();
}


