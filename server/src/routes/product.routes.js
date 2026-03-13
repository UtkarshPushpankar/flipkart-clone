const router = require('express').Router();
const {
  getProducts,
  getProductById,
  getCategories,
  getFeatured,
  getProductFacets,
} = require('../controllers/productController');

router.get('/', getProducts);
router.get('/facets', getProductFacets);
router.get('/featured', getFeatured);
router.get('/categories', getCategories);
router.get('/:id', getProductById);

module.exports = router;
