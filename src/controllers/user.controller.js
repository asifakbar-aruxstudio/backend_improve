import asyncHandler from "../utills/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utills/ApiError.js";
import { uploadToCloudinary } from "../utills/cloudinary.js";
import { ApiResponse } from "../utills/ApiResponse.js";
import jwt from "jsonwebtoken"







const genrateAccessAndRefreshToken = async(userId)=>{
    try{

        const user = await User.findById(userId)
        const accessToken = user.genrateAccessToken();
        const refreshToken  = user.genrateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave : false })

    }catch(error){
        throw new ApiError(500 ," something wrong while genrating Access and Refresh Token")
    }
} 
const registerUser = asyncHandler(async(req, res) => {
  
//get data from frontend
//validate data it not empty
//check if user already exists
//check avtar and coverImage 
//create object .create user in db 
// remove password and accesstoken from response
//check if user is created successfully
//send response to frontend

    const { fullName, userName, email, password } = req.body; // get data from frontend
    if(
        [fullName, userName, email, password].some((field) => 
         field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }

   const existUser = await User.findOne({
    $or: [{ email }, { userName }],
   })

   if(existUser){
    throw new ApiError(409, "User already exists");
   }    

//    const avatarLocalPath = req.files?.avatar[0]?.path;
//    const coverImageLocalPath = req.files?.coverImage[0]?.path;

//    if (!avatarLocalPath || !coverImageLocalPath) {
//     throw new ApiError(400, "Avatar and cover image are required");
//    }    

   //const avatar = await uploadToCloudinary(avatarLocalPath, "avatar");
   //const coverImage = await uploadToCloudinary(coverImageLocalPath, "coverImage");

// //   if(!avatar || !coverImage){
//     throw new ApiError(500, "Failed to upload images");
//    }    

   const user = await User.create({
    fullName,
    userName: userName.toLowerCase(),
    email,
    password,
    // avatar: avatar.url,
    // coverImage: coverImage?.url || "",
});
    const createdUser = await User.findById(user._id).select("-password -refreshToken")
        if(!createdUser){
    throw new ApiError(500, "User not found after creation");
        } 
        
        return res.status(201).json(
        new ApiResponse(201,  createdUser , "User registered successfully")

         )

})




const loginUser = asyncHandler(async (req,res)=>{
// get date from req.body 
 const {userName , email , password } = req.body;

 // agr username ya email nahy hai to error through  kro 
 if(!(userName || email)) { 
    throw new ApiError(400 , "username and password are required") 
}
// check email and username 

  const user = await User.findOne({
    $or: [{userName} , {email}]
});

//find user 

if(!user){
    throw new ApiError (404 ,"user does not exits")
}

// check password
const passwordValidate = await user.isPasswordCorrect(password)
    if(!passwordValidate){
        throw new ApiError(401 ," Invalid User Credentional ")
}

// use access and refresh token 

const { accessToken , refreshToken } = await genrateAccessAndRefreshToken(user._id)
          const loggedinUser  = await User.findById(user._id).select("_password  _refreshToken")


          // send cookies 
          const options = {
           httpOnly : true,
           secure : true
          }

          //return response 
          return res 
          .status(200)
          .cookie("accessToken" , accessToken, options)
          .cookie("refreshToken", refreshToken, options)
          .json(
            new ApiResponse(200,{
                user : loggedinUser , accessToken , refreshToken,
            }, 
               "user loggedIn successfully"
               )
          )
})


const logoutUser = asyncHandler(async(req,res)=>{

await User.findByIdAndUpdate(req.user._id,
{

    $unset : {
        refreshToken : 1
       }
    },

    {
        new : true
    }
)

const options ={
    httpOnly: true,
    secure :true
}
    
return res
.status(200)
.ClearCookie("accessToken", options)
.ClearCookie("refreshToken", options)
.json(
    new ApiResponse(200 ,{}, "user logout Successfully")
  )

})


export { registerUser , loginUser , logoutUser };