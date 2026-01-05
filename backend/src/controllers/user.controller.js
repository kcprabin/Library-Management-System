import { asyncHandler } from "../utils/asynchandler.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const registerUser = asyncHandler(async (req, res) => {
  //Handle user inputs from frontend as objects
  const { studentemail, password, userName ,role  } = req.body;

  if(!studentemail||!password || !userName || !role ){
    return res.status(300).json({
      message:"empty feild",
      success:false
    })
  }

  //checking if already exists
  const userExist = await User.findOne(
    { studentemail: studentemail }
  );

  if (userExist) {
    return res.status(300).json({
      success: false,
      message: "User already exits",
    });
  }

  //checking if UsernameTaken or not
  const TakenName = await User.findOne(
    { userName: userName }
  );

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
    "-password -refreshtoken"
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

const autoLogin = asyncHandler ( async(req,res)=>{
  try {
    const token = req.cookies.accesstokens
    if(!token){
      return res.status(400).json({
        success:false,
        message:"no tokens"
      })
    }
    const decodedToken = jwt.verify(token , process.env.ACCESS_TOKEN)


     const userrole= await User.findById(decodedToken._id)
     const role = userrole.role

    
  
      return res.status(200).json({
        success:true,
        message:"valid bearer tokens",
        role:role
      })
    
  } catch (error) {
    res.status(400).json({
      success:false,
      message:"unable to get cookies login again"
    })
    
  }
})

export { registerUser,
         loginUser,
        logout ,
      autoLogin}
