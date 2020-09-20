const express = require('express');

const router = express.Router();
const userController = require('../controllers/userController');
const index = require('../controllers/index');
const auth = require('../middleware/auth');

router.post('/signup', userController.signup);

router.post('/login', userController.login);

router.get('/logout', (req, res) => {
    res.render('index', {title: 'You have logged out'})
})

router.get('/user/:userId', auth.allowIfLoggedin, userController.getUser);

router.get('/users', auth.allowIfLoggedin, auth.grantAccess('readAny', 'profile'), userController.getUsers);

router.put('/user/:userId', auth.allowIfLoggedin, auth.grantAccess('updateAny', 'profile'), userController.updateUser);

router.delete('/user/:userId', auth.allowIfLoggedin, auth.grantAccess('deleteAny', 'profile'), userController.deleteUser);


module.exports = router;
