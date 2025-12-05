import Payment from "../models/PaymentModel.js";

// @desc   Create a payment
// @route  POST /api/payments
// @access Private (user)
export const createPayment = async (req, res) => {
  try {
    const { courseId, amount, paymentMethod, transactionId } = req.body;

    if (!courseId || !amount) {
      return res.status(400).json({ message: "Course and amount required" });
    }

    const newPayment = await Payment.create({
      user: req.user._id, // assume req.user comes from auth middleware
      course: courseId,
      amount,
      paymentMethod: paymentMethod || "manual",
      transactionId,
      status: "completed", // For demo purposes, mark as completed
    });

    res.status(201).json({
      success: true,
      payment: newPayment,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Get all payments of logged-in user
// @route  GET /api/payments/my
// @access Private (user)
export const getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id }).populate("course", "title price");
    res.status(200).json({ success: true, payments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Admin: get all payments
// @route  GET /api/payments
// @access Private (admin)
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("user", "firstName email")
      .populate("course", "title");
    res.status(200).json({ success: true, payments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
