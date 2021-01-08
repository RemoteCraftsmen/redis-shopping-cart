const express = require('express');
const router = express.Router();
const ResetController = require('../controllers/Reset/ResetController');

module.exports = app => {
    const redisClientService = app.get('redisClientService');

    const resetController = new ResetController(redisClientService);

    router.get('/', (...args) => resetController.index(...args));

    return router;
};
