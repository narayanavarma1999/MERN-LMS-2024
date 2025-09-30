const express = require("express");
const { getOrderAnalytics, getOrderInfo } = require("../../controllers/orders-controller/order-info-controller");

const router = express.Router();

router.get('/analytics', getOrderAnalytics);
router.get('/:orderId/refund-info', getOrderInfo);

module.exports = router;