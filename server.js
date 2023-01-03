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

app.use('/users', require('./app/controllers/user.controller'));
app.use('/mobis', require('./app/controllers/mobi.controller'));
app.use('/usersMobis', require('./app/controllers/userMobi.controller'));
app.use('/logs', require('./app/controllers/log.controller'));



app.listen(PORT, () => {
    console.log(`Serveur ecoute sur le port: ${PORT}.`);
});



// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;

app.listen(port, () => console.log('Server listening on port ' + port));