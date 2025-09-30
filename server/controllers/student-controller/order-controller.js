const Order = require("../../models/Order");
const Course = require("../../models/Course");
const StudentCourses = require("../../models/StudentCourses");
const razorpay = require("../../helpers/razorpay");
const crypto = require("crypto");
const { format } = require('date-fns');

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      userName,
      userEmail,
      orderStatus,
      paymentMethod,
      paymentStatus,
      orderDate,
      instructorId,
      instructorName,
      courseImage,
      courseTitle,
      courseId,
      coursePricing
    } = req.body;

    const amountInPaise = Math.round(coursePricing * 100);

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: generateReceiptId(),
      notes: {
        courseId: courseId.toString(),
        userId: userId.toString(),
        courseTitle: courseTitle,
      },
      payment_capture: 1
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Create order in database
    const newlyCreatedCourseOrder = new Order({
      userId,
      userName,
      userEmail,
      receipt: razorpayOrder.receipt,
      orderStatus: orderStatus || "created",
      paymentMethod: paymentMethod || "razorpay",
      paymentStatus: paymentStatus || "pending",
      orderDate: orderDate || format(new Date(), 'yyyy-MM-dd HH:mm'),
      razorpayOrderId: razorpayOrder.id,
      instructorId,
      instructorName,
      courseImage,
      courseTitle,
      courseId,
      coursePricing,
      amountInPaise
    });

    await newlyCreatedCourseOrder.save();

    res.status(201).json({
      success: true,
      data: {
        razorpayOrderId: razorpayOrder.id,
        amount: amountInPaise,
        currency: "INR",
        receipt: razorpayOrder.receipt,
        orderId: newlyCreatedCourseOrder._id,
        key: process.env.RAZORPAY_KEY_ID,
        orderDate
      },
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Error while creating Razorpay order!",
    });
  }
};

const verifyPaymentAndFinalizeOrder = async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      orderId
    } = req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !orderId) {
      return res.status(400).json({
        success: false,
        message: "Missing required payment verification fields",
      });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      console.warn(`Payment signature verification failed for order: ${orderId}`);
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    let order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.paymentStatus === "paid") {
      return res.status(200).json({
        success: true,
        message: "Payment already processed",
        data: order,
      });
    }

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;
    order.paymentDate = format(new Date(), 'yyyy-MM-dd HH:mm')

    await order.save();

    const studentCourses = await StudentCourses.findOne({
      userId: order.userId,
    });

    if (studentCourses) {
      const courseExists = studentCourses.courses.some(
        course => course.courseId.toString() === order.courseId.toString()
      );

      if (!courseExists) {
        studentCourses.courses.push({
          courseId: order.courseId,
          title: order.courseTitle,
          instructorId: order.instructorId,
          instructorName: order.instructorName,
          dateOfPurchase: order.orderDate,
          courseImage: order.courseImage,
        });
        await studentCourses.save();
      }
    } else {
      const newStudentCourses = new StudentCourses({
        userId: order.userId,
        courses: [
          {
            courseId: order.courseId,
            title: order.courseTitle,
            instructorId: order.instructorId,
            instructorName: order.instructorName,
            dateOfPurchase: order.orderDate,
            courseImage: order.courseImage,
          },
        ],
      });
      await newStudentCourses.save();
    }

    await Course.findByIdAndUpdate(order.courseId, {
      $addToSet: {
        students: {
          studentId: order.userId,
          studentName: order.userName,
          studentEmail: order.userEmail,
          paidAmount: order.coursePricing,
          enrolledAt: format(new Date(), 'yyyy-MM-dd HH:mm'),
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Payment verified and order confirmed",
      data: order,
    });

  } catch (err) {
    console.error('Payment verification error:', err);
    res.status(500).json({
      success: false,
      message: "Error while verifying payment!",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Error fetching order details",
    });
  }
};

const generateReceiptId = () => {
  const ts = Date.now();
  const rand = Math.floor(Math.random() * 10000);
  return `rcpt_${ts}_${rand}`;
};


module.exports = {
  createOrder,
  verifyPaymentAndFinalizeOrder,
  getOrderDetails
};