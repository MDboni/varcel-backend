import express from "express";
import * as UserController from "../controllers/UserControler.js";
import * as CourseController from "../controllers/courseController.js";
import * as PaymentController from "../controllers/paymentController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Test route
router.get("/test", (req, res) => {
  res.status(200).json({ status: "success", message: "API Router Working!" });
});

// User routes
router.post("/register", UserController.registerUser);
router.post("/verify-otp", UserController.verifyOtp);
router.post("/login", UserController.loginUser);
router.post("/logOut", authMiddleware, UserController.UserLogOut);

// Course routes
router.post("/CoursePost", CourseController.createCourse);
router.get("/allCourse", CourseController.getAllCourses);
router.get("/courses/:id", authMiddleware, CourseController.getCourseDetails);

// Payment routes 

// User payments
router.post("/coursePayment", authMiddleware, PaymentController.createPayment);
router.get("/myCoursePayment", authMiddleware, PaymentController.getMyPayments);

// Admin payments
router.get("/getAllPayment", authMiddleware, PaymentController.getAllPayments);

export default router;
