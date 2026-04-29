const express = require('express');

const productController = require('./productController');

const router = express.Router();

router.get('/', productController.index);
router.get('/new', productController.newProductForm);
router.post('/', productController.create);
router.get('/:id', productController.detail);
router.get('/:id/edit', productController.editForm);
router.put('/:id', productController.update);
router.delete('/:id', productController.remove);

module.exports = router;
