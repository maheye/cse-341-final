const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');
const validation = require('../middleware/validate');
const { isAuthenticated } = require('../middleware/authenticate');

router.get('/', usersController.getAllUsers);

router.get('/:id', usersController.getUserById);

router.post('/', isAuthenticated, validation.saveUser, usersController.createUser);

router.put('/:id', isAuthenticated, validation.saveUser, usersController.updateUserById);

router.delete('/:id', isAuthenticated, usersController.deleteUserById);

module.exports = router;