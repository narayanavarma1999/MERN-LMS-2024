const express = require("express");
const {
  createOrder,
  getOrderDetails,
  verifyPaymentAndFinalizeOrder,
} = require("../../controllers/student-controller/order-controller");

const router = express.Router();

router.post("/create", createOrder);

router.post('/verify', verifyPaymentAndFinalizeOrder);

router.get('/order/:orderId', getOrderDetails);


module.exports = router;
