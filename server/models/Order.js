const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  userName: {
    type: String,
    required: true,
    trim: true
  },
  userEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  orderStatus: {
    type: String,
    enum: ['created', 'pending', 'confirmed', 'completed', 'cancelled', 'failed'],
    default: 'created'
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  paymentMethod: {
    type: String,
    enum: ['razorpay', 'card', 'upi', 'netbanking'],
    default: 'razorpay'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'processing', 'paid', 'failed', 'refunded', 'partially_refunded'],
    default: 'pending'
  },
  razorpayOrderId: {
    type: String,
    required: true,
    unique: true
  },
  razorpayPaymentId: {
    type: String,
    sparse: true 
  },
  razorpaySignature: {
    type: String,
    sparse: true
  },
  paymentDate: {
    type: Date
  },
  receipt: {
    type: String,
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  courseTitle: {
    type: String,
    required: true,
    trim: true
  },
  courseImage: {
    type: String,
    required: true
  },
  coursePricing: {
    type: Number, 
    required: true,
    min: 0
  },
  instructorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  instructorName: {
    type: String,
    required: true,
    trim: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  amountInPaise: {
    type: Number,
    required: true
  },
  refunds: [{
    refundId: String,
    amount: Number,
    reason: String,
    processedAt: Date,
    status: {
      type: String,
      enum: ['requested', 'processed', 'failed']
    }
  }],
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

OrderSchema.virtual('amountInRupees').get(function() {
  return this.amountInPaise / 100;
});

OrderSchema.index({ userId: 1, orderDate: -1 });
OrderSchema.index({ razorpayOrderId: 1 });
OrderSchema.index({ paymentStatus: 1 });
OrderSchema.index({ orderStatus: 1 });
OrderSchema.index({ createdAt: 1 });

OrderSchema.statics.findByRazorpayOrderId = function(razorpayOrderId) {
  return this.findOne({ razorpayOrderId });
};

OrderSchema.methods.isPaymentSuccessful = function() {
  return this.paymentStatus === 'paid' && this.orderStatus === 'confirmed';
};

OrderSchema.methods.markAsPaid = function(paymentId, signature) {
  this.paymentStatus = 'paid';
  this.orderStatus = 'confirmed';
  this.razorpayPaymentId = paymentId;
  this.razorpaySignature = signature;
  this.paymentDate = new Date();
  return this.save();
};

OrderSchema.pre('save', function(next) {
  if (this.coursePricing && !this.amountInPaise) {
    this.amountInPaise = Math.round(this.coursePricing * 100);
  }
  next();
});


OrderSchema.methods.getFormattedDates = function() {
  const { format } = require('date-fns');
  
  return {
    orderDate: format(this.orderDate, 'MMM dd, yyyy • hh:mm a'),
    paymentDate: this.paymentDate ? format(this.paymentDate, 'MMM dd, yyyy • hh:mm a') : null,
    createdAt: format(this.createdAt, 'MMM dd, yyyy • hh:mm a'),
    updatedAt: format(this.updatedAt, 'MMM dd, yyyy • hh:mm a')
  };
};

OrderSchema.methods.getRefundInfo = function() {
  const { addDays, differenceInDays, isAfter, format } = require('date-fns');
  
  if (!this.paymentDate || this.paymentStatus !== 'paid') {
    return { eligible: false, reason: 'Payment not completed' };
  }

  const refundDeadline = addDays(this.paymentDate, 30);
  const daysRemaining = differenceInDays(refundDeadline, new Date());
  const isEligible = !isAfter(new Date(), refundDeadline);

  return {
    eligible: isEligible,
    daysRemaining: isEligible ? daysRemaining : 0,
    deadline: format(refundDeadline, 'MMM dd, yyyy'),
    deadlinePassed: !isEligible
  };
};

module.exports = mongoose.model("Order", OrderSchema);
