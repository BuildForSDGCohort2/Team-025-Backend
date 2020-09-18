const express = require('express')
const router = express.Router();
const auth = require('../middleware/auth');

const appointmentController = require('../controllers/appointments');
const slotController = require('../controllers/slot');

router.get('/appointments', auth.allowIfLoggedin, appointmentController.all);

router.get('/retrieveSlots', auth.allowIfLoggedin, slotController.all);

router.post('/appointmentCreate', auth.allowIfLoggedin, appointmentController.create);


module.exports = router;