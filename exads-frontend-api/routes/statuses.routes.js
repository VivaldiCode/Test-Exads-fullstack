const StatusesController = require('../controllers/statuses.controller')
const express = require('express');
const router = express.Router();

router.get('/', StatusesController.get);
router.get('/:id', StatusesController.getOne);

module.exports = router;
