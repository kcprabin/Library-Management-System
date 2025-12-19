import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asynchandler.js";
import jwt from "jsonwebtoken";

export const loginInCheck = asyncHandler(async (req, res, next) => {
  try {
    let token;

 
    if (req.cookies?.accesstokens) token = req.cookies.accesstokens;

    
    else if (req.header("Authorization")?.startsWith("Bearer ")) {
      token = req.header("Authorization").split(" ")[1]; // safer than replace
    }

   
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token not provided",
      });
    }

   
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Token is invalid or expired",
        error: err.message,
      });
    }

    // 5️⃣ Find user by ID in token
    const user = await User.findById(decodedToken._id).select("-password -refreshtoken");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // 6️⃣ Attach user to request
    req.user = user;

    next();
  } catch (error) {
    console.error(error, "Error in auth middleware");
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});
