const express = require('express');
const router = express.Router();
const ResetDataController = require('../controllers/ResetData/ResetDataController');

module.exports = app => {
    const redisClientService = app.get('redisClientService');

    const resetDataController = new ResetDataController(redisClientService);

    router.get('/', (...args) => resetDataController.index(...args));

    return router;
};
