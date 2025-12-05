// src/middleware/authMiddleware.js
import { DecodeToken } from "../utils/tokenUtility.js";

export default (req, res, next) => {
  try {
    // Authorization header 
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ status: "fail", message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    // Token decode
    const decoded = DecodeToken(token);
    if (!decoded) {
      return res.status(401).json({ status: "fail", message: "Unauthorized" });
    }

    // Middleware 
    req.user = {
      email: decoded.email,
      user_id: decoded.user_id,
    };

    next();
  } catch (error) {
    console.error("Auth Error:", error.message);
    return res.status(401).json({ status: "fail", message: "Unauthorized" });
  }
};
