const { createTestObject } = require('../controllers');

const router = require('express').Router();

router.get('/', (req, res) => {
    res.send('Hello World!');
})

router.get('/test', createTestObject);

module.exports = {
    router
};