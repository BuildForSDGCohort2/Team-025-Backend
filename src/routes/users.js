const express = require('express');
const { index } = require('../controllers/index');
var router = express.Router();

/* GET users listing. */
router.get('/', index);

module.exports = router;
