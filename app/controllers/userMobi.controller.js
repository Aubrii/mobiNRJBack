const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('../_middleware/validate-request');
const  userMobiService = require('../services/userMobi.service')

router.post('/addMobiToUser/:id', addMobiToUsers);
router.get('/', getAll);
router.get('/:id', getById);
router.post('/new', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);

module.exports = router;



function getAll(req, res, next) {
    userMobiService.getAll()
        .then(mobi => res.json(mobi))
        .catch(next);
}

function addMobiToUsers(req, res, next){
    console.log("params", req.params)
    console.log("body",req.body)
    userMobiService.addMobiToUser(req.params.id, req.body)
        .then(() => res.json({
            message: 'test add mobi user',
            userMobi: req.body
        }))
        .catch(next);
}

function getById(req, res, next) {
    userMobiService.getById(req.params.id)
        .then(mobi => res.json(mobi))
        .catch(next);
}
function create(req, res, next) {
    userMobiService.create(req.body)
        .then(() => res.send({
            message: 'user mobi créer',
            mobi: req.body
        }))
        .catch(next);
}

function update(req, res, next) {
    userMobiService.update(req.params.id, req.body)
        .then(() => res.json({
            message: 'user Mobi  modifier',
            mobi: req.body
        }))
        .catch(next);
}

function _delete(req, res, next) {
    userMobiService.delete(req.params.id)
        .then(() => res.json({
            message: 'user mobi effacer',
            mobi: req.body
        }))
        .catch(next);
}

function createSchema(req, res, next) {
    const schema = Joi.object({
        UserId: Joi.number(),
        MobiId: Joi.number(),
        quantityAutorize:Joi.number(),
        quantityGet:Joi.number(),

    });
    validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        UserId: Joi.number(),
        MobiId: Joi.number(),
        quantityAutorize:Joi.number(),
        quantityGet:Joi.number(),
    })
    validateRequest(req, next, schema);
}