const router = require('express').Router();
const { placeOrder, getOrders, getOrderById } = require('../controllers/orderController');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);
router.post('/', placeOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);

module.exports = router;
