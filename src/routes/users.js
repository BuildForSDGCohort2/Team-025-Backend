const express = require('express');
const { users } = require('../controllers/users');
var router = express.Router();

/* GET users listing. */
router.get('/', users);

module.exports = router;
