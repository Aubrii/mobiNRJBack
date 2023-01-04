const express = require('express');
const router = express.Router();
const Joi = require('joi');
const Role = require('../_helpers/role');
const userService = require('../services/User.service');
const db = require("../_helpers/db");
const validateRequest = require('../_middleware/validate-request');
const {addMobiToUser} = require("../services/user.service");
const authorize = require("../_middleware/authorize");

// routes

router.post('/test/:id', addMobiToUsers)
router.get('/',getAll);
router.get('/:id', getById);
router.post('/new', createSchema, create,);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);
router.post('/authenticate', authenticateSchema, authenticate);
router.get('/current',authorize(), getCurrent);



module.exports = router;

// route functions

function addMobiToUsers(req, res, next){
    console.log("params", req.params)
    console.log("body",req.body)
    userService.addMobiToUser(req.params.id, req.body)
        .then(() => res.json({
            message: 'test add mobi user',
            userMobi: req.body
        }))
        .catch(next);
}

function authenticateSchema(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => res.json(user))
        .catch(next);
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(next);
}

function getCurrent(req, res, next) {
    res.json(req.user);
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => res.json(user))
        .catch(next);
}

function create(req, res, next) {
    userService.create(req.body)
        .then(() => res.json({
            message: 'User created',
            user: req.body
        }))
        .catch(next);
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(() => res.json({
            message: 'User updated',
            user: req.body
        }))
        .catch(next);
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({ message: 'User deleted' }))
        .catch(next);
}

// schema functions

function createSchema(req, res, next) {
    const schema = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        role: Joi.string().valid(Role.Admin, Role.Users,Role.SuperAdmin).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        avatarUrl: Joi.string()

    },);
    console.log('toto')
    validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        firstName: Joi.string().empty(''),
        lastName: Joi.string().empty(''),
        role: Joi.string().valid(Role.Admin, Role.Users,Role.SuperAdmin).empty(''),
        email: Joi.string().email().empty(''),
        password: Joi.string().min(6).empty(''),
        avatarUrl: Joi.string()


    })
    validateRequest(req, next, schema);
}
