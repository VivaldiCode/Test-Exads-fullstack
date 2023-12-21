const UserController = require('../controllers/users.controller')
const express = require('express');
const router = express.Router();

router.get('/', UserController.get);
router.post('/', UserController.create);
router.get('/:id', UserController.getOne);
router.patch('/:id', UserController.update);

module.exports = router;
