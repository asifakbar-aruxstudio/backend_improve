import asyncHandler from "../utills/asyncHandler.js";
import { ApiError } from "../utills/ApiError.js";   


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

});   
    


export { registerUser };
