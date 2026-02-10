import { asyncHandler } from "../utils/asynchandler.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import mailSender from "../middleware/mail.middleware.js";


const registerUser = asyncHandler(async (req, res) => {
  const { studentemail, password, userName, role } = req.body;

  if (!studentemail || !password || !userName || !role) {
    return res.status(300).json({
      message: "empty feild",
      success: false,
    });
  }

  //checking if already exists
  const userExist = await User.findOne({ studentemail: studentemail });

  if (userExist) {
    return res.status(300).json({
      success: false,
      message: "User already exits",
    });
  }

  //checking if UsernameTaken or not
  const TakenName = await User.findOne({ userName: userName });

  if (TakenName) {
    return res.status(300).json({
      success: false,
      message: "UserName already Taken",
    });
  }

  // saving data in database
  const user = await User.create({
    studentemail: studentemail,
    password: password,
    userName: userName,
    role: role,
  });

  const userCreated = await User.findById(user._id).select(
    "-password -refreshtoken",
  );
  if (!userCreated) {
    return res.status(300).json({
      success: false,
      message: "failed to register use1111r",
    });
  }

  return res.status(201).json({
    success: true,
    message: "User created",
    user: userCreated,
  });
});

const generateRefreshTokenAndAccesToken = async (userid) => {
  try {
    const user = await User.findById(userid);
    const refreshToken = user.generateRefreshToken();
    const accessToken = user.generateAccessToken();
    user.refreshtoken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { refreshToken, accessToken };
  } catch (error) {
    console.log(error, "error in creating refresh token and accestoken ");
  }
};

const loginUser = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "empty string",
    });
  }

  // check user and role
  const user = await User.findOne({
    $and: [{ studentemail: email }, { role }],
  });

  if (!user) {
    return res.status(400).json({
      message: "Not activates user",
    });
  }

  const Validate = await user.IsPasswordCorrect(password);
  if (!Validate) {
    return res.status(400).json({
      messege: "Wrong password",
    });
  }

  const { refreshToken, accessToken } = await generateRefreshTokenAndAccesToken(
    user._id,
  );

  const options = {
    httpOnly: true,
    secure: false,
    sameSite: "lax", // or 'none' with secure: true for cross-site
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  return res
    .status(200)
    .cookie("refreshtokens", refreshToken, options)
    .cookie("accesstokens", accessToken, options)
    .json({
      success: true,
      message: "Login sucessfull",
      user: {
        id: user._id,
        name: user.userName,
        email: user.email,
        role: user.role,
      },
    });
});

const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshtoken: null,
      },
    },
    { new: true },
  );

  const options = {
    httpOnly: true,
    secure: false,
  };

  res
    .status(201)
    .clearCookie("accesstokens", options)
    .clearCookie("refreshtokens", options)
    .json({
      message: "logout sucessfull",
      success: true,
    });
});

const autoLogin = asyncHandler(async (req, res) => {
  try {
    const token = req.cookies.accesstokens;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token found",
      });
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN);
    const user = await User.findById(decodedToken._id).select(
      "-password -refreshtoken",
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Valid token",
      user: {
        name: user.userName,
        role: user.role,
        email: user.studentemail,
      },
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Session expired, please login again",
    });
  }
});

const getProfile = asyncHandler(async (req, res) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user: {
      name: user.userName,
      email: user.studentemail,
      role: user.role,
      createdate: user.createdAt,
    },
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "User not found",
    });
  }

  const { userName, studentemail } = req.body;
  if (!userName && !studentemail) {
    return res.status(400).json({
      success: false,
      message: "No data to update",
    });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "User not found",
    });
  }

  user.userName = userName || user.userName;
  user.studentemail = studentemail || user.studentemail;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user: {
      name: user.userName,
      email: user.studentemail,
      role: user.role,
    },
  });
});

const changePassword = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "User not found",
    });
  }

  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Current password and new password are required",
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: "New password must be at least 6 characters",
    });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "User not found",
    });
  }

  const isPasswordCorrect = await user.IsPasswordCorrect(currentPassword);
  if (!isPasswordCorrect) {
    return res.status(400).json({
      success: false,
      message: "Current password is incorrect",
    });
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  const user = await User.findOne({ studentemail: email });
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "User not found",
    });
  }

  const resetCode = Math.floor(Math.random() * 1000000); // Example reset code
  user.resetCode = resetCode;
  user.resetCodeExpiry = Date.now() + 3600000; // 1 hour expiry
  await user.save({ validateBeforeSave: false });

  try {
    await mailSender(email, resetCode);
  } catch (error) {
    console.log(error, "Error sending reset email");
    return res.status(500).json({
      success: false,
      message: "Failed to send reset instructions",
    });
  }

  res.status(200).json({
    success: true,
    message: "Password reset instructions sent to email",
  });
});

const resetPassword = asyncHandler(async (req, res) => {

  const { email, resetCode, newPassword } = req.body;
  if (!email || !resetCode || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Email, reset code, and new password are required",
    });
  }

  const user = await User.findOne({ studentemail: email });
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "User not found",
    });
  }

  if (
    user.resetCode !== resetCode ||
    user.resetCodeExpiry < Date.now()
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid or expired reset code",
    });
  }

  user.password = newPassword;
  user.resetCode = null;
  user.resetCodeExpiry = null;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Password reset successfully",
  });
});

export {
  // Generate reset token and send email logic here
  registerUser,
  loginUser,
  logout,
  autoLogin,
  getProfile,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
};
