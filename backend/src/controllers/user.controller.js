import { asyncHandler } from "../utils/asynchandler.js";
import { User } from "../models/user.model.js";

const registerUser = asyncHandler(async (req, res) => {
  //Handle user inputs from frontend as objects
  const { studentemail, Password, role, kuid } = req.body;

  // validations of correct format for empty
  if (
    Object.values({ studentemail, Password, kuid }).some(
      (data) => String(data)?.trim() == ""
    )
  ) {
    return res.status(400).json({
      success: false,
      message: "Empty feild",
    });
  }

  // email formatiing check
  const gmailFormat = /^.*@gmail\.com$/;
  if (!gmailFormat.test(studentemail)) {
    return res.status(400).json({
      success: false,
      message: "not in format",
    });
  }

  //checking if already exists
  const userExist = await User.findOne({
    $or: [{ studentemail: studentemail }, { kuid: kuid }],
  });

  if (userExist) {
    return res.status(409).json({
      success: false,
      message: "User already exits",
    });
  }

  // saving data in database
  const user = await User.create({
    studentemail: studentemail,
    password: Password,
    role: role,
    kuid: kuid,
  });

  const userCreated = await User.findById(user._id).select(
    "-password -refreshtoken"
  );
  if (!userCreated) {
    res.status(401).json({
      success: false,
      message: "failed to register user",
    });
  }

  return res.status(201).json({
    success: true,
    messege: "User created",
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
  const { email, password , role } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "empty string",
    });
  }

  // check user and role
  const user = await User.findOne({
    $and: [{ studentemail:email }, { role }],
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
    user._id
  );

  console.log(refreshToken)
  const options = {
    httpOnly: true,
    secure: false,
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
        name: user.fullname,
        email: user.email,
        role: user.role,}
})
});

const logout = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id,
        {
            $set:{
                refreshtoken:null
            }
        },
        {new:true}
    )

     const options = {
    httpOnly: true,
    secure: false,
  };

    res.status(201)
    .clearCookie("accesstokens",options)
    .clearCookie("refreshtokens",options)
    .json({
        message:"logout sucessfull",
        success:true
    })



});

export { registerUser,
         loginUser,
        logout }
