const { format, isAfter, addDays, differenceInDays, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays } = require('date-fns');
const Order = require('../../models/Order');

const getOrderAnalytics = async (req, res) => {
    try {
        const { period = 'today' } = req.query;

        let startDate, endDate;
        const now = new Date();

        switch (period) {
            case 'today':
                startDate = startOfDay(now);
                endDate = endOfDay(now);
                break;
            case 'week':
                startDate = startOfWeek(now);
                endDate = endOfWeek(now);
                break;
            case 'month':
                startDate = startOfMonth(now);
                endDate = endOfMonth(now);
                break;
            case 'last7days':
                startDate = subDays(now, 7);
                endDate = now;
                break;
            case 'last30days':
                startDate = subDays(now, 30);
                endDate = now;
                break;
            default:
                startDate = startOfDay(now);
                endDate = endOfDay(now);
        }

        const orders = await Order.find({
            createdAt: { $gte: startDate, $lte: endDate }
        });

        const totalRevenue = orders
            .filter(order => order.paymentStatus === 'paid')
            .reduce((sum, order) => sum + order.coursePricing, 0);

        const successfulOrders = orders.filter(order => order.paymentStatus === 'paid').length;
        const pendingOrders = orders.filter(order => order.paymentStatus === 'pending').length;
        const failedOrders = orders.filter(order => order.paymentStatus === 'failed').length;

        res.status(200).json({
            success: true,
            data: {
                period,
                dateRange: {
                    start: format(startDate, 'yyyy-MM-dd'),
                    end: format(endDate, 'yyyy-MM-dd')
                },
                summary: {
                    totalOrders: orders.length,
                    successfulOrders,
                    pendingOrders,
                    failedOrders,
                    totalRevenue,
                    conversionRate: orders.length > 0 ? (successfulOrders / orders.length) * 100 : 0
                },
                orders: orders.map(order => ({
                    ...order._doc,
                    formattedDate: format(order.createdAt, 'MMM dd, yyyy • hh:mm a')
                }))
            }
        });

    } catch (err) {
        console.log('Analytics error:', err);
        res.status(500).json({
            success: false,
            message: "Error fetching order analytics",
        });
    }
};

const getOrderInfo = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.json({
            success: true,
            data: {
                refundInfo: order.getRefundInfo(),
                formattedDates: order.getFormattedDates()
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const {




} = require('date-fns');


const OrderUtils = {

    formatOrderDate: (date) => {
        return format(date, 'MMM dd, yyyy • hh:mm a');
    },

    // Check if order is within refund period (30 days)
    isWithinRefundPeriod: (orderDate) => {
        const refundDeadline = addDays(orderDate, 30);
        return isAfter(new Date(), refundDeadline) ? false : true;
    },

    // Calculate days remaining for refund
    getRefundDaysRemaining: (orderDate) => {
        const refundDeadline = addDays(orderDate, 30);
        return differenceInDays(refundDeadline, new Date());
    },

    // Check if payment link is expired (24 hours)
    isPaymentLinkExpired: (orderDate) => {
        const expirationTime = addDays(orderDate, 1); // 24 hours
        return isAfter(new Date(), expirationTime);
    },

    // Get today's orders count
    getTodaysOrders: async () => {
        const todayStart = startOfDay(new Date());
        const todayEnd = endOfDay(new Date());

        return await Order.countDocuments({
            createdAt: {
                $gte: todayStart,
                $lte: todayEnd
            }
        });
    }
};

// Enhanced verifyPayment function with date tracking

module.exports = { getOrderAnalytics, getOrderInfo }