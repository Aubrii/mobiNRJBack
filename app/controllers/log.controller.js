const express = require('express');
const router = express.Router();
const  logService = require('../services/log.service')


router.get('/', getAll);
module.exports = router;



function getAll(req, res, next) {
    logService.getAll()
        .then(mobi => res.json(mobi))
        .catch(next);
}
