const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('../_middleware/validate-request');
const  mobiService = require('../services/mobi.service')


router.get('/', getAll);
router.get('/:id', getById);
router.post('/new', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);

module.exports = router;



function getAll(req, res, next) {
    mobiService.getAll()
        .then(mobi => res.json(mobi))
        .catch(next);
}

function getById(req, res, next) {
    mobiService.getById(req.params.id)
        .then(mobi => res.json(mobi))
        .catch(next);
}
function create(req, res, next) {
    mobiService.create(req.body)
        .then(() => res.send({
            message: 'mobi créer',
            mobi: req.body
        }))
        .catch(next);
}

function update(req, res, next) {
    mobiService.update(req.params.id, req.body)
        .then(() => res.json({
            message: 'mobi modifier',
            mobi: req.body
        }))
        .catch(next);
}

function _delete(req, res, next) {
    mobiService.delete(req.params.id)
        .then(() => res.json({
            message: 'mobi effacer',
            mobi: req.body
        }))
        .catch(next);
}

function createSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string(),
        quantityMax:Joi.number(),
        localisation: Joi.string(),
    });
    validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string(),
        quantityMax:Joi.number(),
        localisation: Joi.string()
    })
    validateRequest(req, next, schema);
}