const router = require('express').Router();
const { getProducts, getProductById, getCategories, getFeatured } = require('../controllers/productController');

router.get('/', getProducts);
router.get('/featured', getFeatured);
router.get('/categories', getCategories);
router.get('/:id', getProductById);

module.exports = router;
