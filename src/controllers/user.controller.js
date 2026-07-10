import asyncHandler from "../utills/asyncHandler.js";
import { ApiError } from "../utills/ApiError.js";   
import {uploadToCloudinary} from "../utills/cloudinary.js";
import { ApiResponse } from "../utills/ApiResponse.js";

const registerUser = asyncHandler(async(req, res) => {
  
//get data from frontend
//validate data it not empty
//check if user already exists
//check avtar and coverImage 
//create object .create user in db 
// remove password and accesstoken from response
//check if user is created successfully
//send response to frontend

    const { fullName, username, email, password } = req.body; // get data from frontend
    if(
        [fullName,username,email,password].some((field) => 
         field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }

   const ExistUser = await User.findOne({
    $or: [{ email }, { username }],
   })
   if(ExistUser){
    throw new ApiError(409, "User already exists");
   }    

   const avatarLocalPath = req.files?.avatar[0]?.path;
   const coverImageLocalPath = req.files?.coverImage[0]?.path;

   if(!avatarLocalPath || !coverImageLocalPath){
    throw new ApiError(400, "Avatar and cover image are required");
   }    

   const avatar = await uploadToCloudinary(avatarLocalPath, "avatar");
   const coverImage = await uploadToCloudinary(coverImageLocalPath, "coverImage");


   if(!avatar || !coverImage){
    throw new ApiError(500, "Failed to upload images");
   }    

   User.create({
    fullName,
    username: username.toLowerCase(),
    email,
    password,
    avatar: avatar.url,
    coverImage: coverImage.url

})

    const createdUser = await User.findById(User._id).select(
        "-password -accessToken")
        if(!createdUser){
            throw new ApiError(500, "User not found after creation");
        } 
        
        return res.status(201).json({
        new ApiResponse(201, createdUser, "User registered successfully")
        
    });


});

export { registerUser };
