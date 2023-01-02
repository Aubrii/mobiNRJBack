const express = require("express");
const cors = require("cors");
const app = express();

//Adresse autorisé par l'API
const corsOptions = {
    origin: "http://localhost:4200"
};

// const db = require("./app/models");
const {request} = require("express");
const errorHandler = require("./app/_middleware/error-handler");
//Synchronisation de la base de données
// db.sequelize.sync()
//     .then(() => {
//         console.log("Base de données synchroniser");
//     })
//     .catch((err) => {
//         console.log("Echec de la synchronisation de la base de données: " + err.message);
//     });

// //Suppression et synchronisation de la base de données
// db.sequelize.sync({ force: true }).then(() => {
//     console.log("Suppression et synchronisation des tables.");
// });


app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));


// set port, listen for requests
const PORT = process.env.PORT || 8080;

// require("./app/route/cout.route")(app);
// require("./app/route/ouvrage.route")(app);

app.use('/users', require('./app/controller/user.controller'));
app.use('/ouvrages', require('./app/controller/ouvrage.controller'))
app.use('/devis', require('./app/controller/devis.controller'))
app.use('/couts',require('./app/controller/cout.controller'));
app.use('/userDevis',require('./app/controller/userDevis.controller'));
app.use('/admin',require('./app/controller/superAdmin.controller'))
app.use('/clients', require('./app/controller/client.controller'));
app.use('/entreprises', require('./app/controller/entreprise.controller'));
app.use('/ouvragesCouts', require('./app/controller/ouvrageCout.controller'));
app.use('/sousLots', require('./app/controller/sousLot.controller'));
app.use('/sousLotsOuvrages', require('./app/controller/sousLotOuvrage.controller'));
app.use('/lots', require('./app/controller/lot.controller'));
app.use('/adresses', require('./app/controller/adresse.controller'))
app.use('/userEntreprise', require('./app/controller/userEntreprise.controller'))
app.use('/coutsDuDevis', require('./app/controller/coutDuDevis.controller'))
app.use('/lotSousLots', require('./app/controller/lotSousLot.controller'))
app.use('/typeCouts', require('./app/controller/typeCout.controller'))
app.use('/fournisseurs', require('./app/controller/fournisseur.controller'))
app.use('/fournisseursCouts', require('./app/controller/fournisseurCout.controller'))


app.listen(PORT, () => {
    console.log(`Serveur ecoute sur le port: ${PORT}.`);
});



// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;

app.listen(port, () => console.log('Server listening on port ' + port));