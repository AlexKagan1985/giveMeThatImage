const { createTestObject } = require('../controllers');

const router = require('express').Router();

function testMe(a) {
  return a + a;
}
router.get('/', (req, res) => {
  res.send('Hello World!');
})

router.get('/test', createTestObject);

module.exports = {
  router,
  testMe,
};
