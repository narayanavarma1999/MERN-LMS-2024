const express = require("express");
const {
  createOrder,
  getOrderDetails,
} = require("../../controllers/student-controller/order-controller");

const router = express.Router();

router.post("/create", createOrder);
router.post("/capture", getOrderDetails);

module.exports = router;
