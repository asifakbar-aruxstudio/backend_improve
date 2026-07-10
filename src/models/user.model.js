import mongoose from "mongoose";
const userSchema = new mongoose.Schema({

fullName: {
        type: String,
        required: true,
        trim: true
    },

    userName: {     
    type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true
    },  

    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true
    },
        avatar: {
        type: String,
        default: "https://res.cloudinary.com/dxj0gqv1f/image/upload/v1690911685/avatars/default-avatar_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1.png",
    },
    coverImage: {
        type: String,
        default: "https://res.cloudinary.com/dxj0gqv1f/image/upload/v1690911685/avatars/default-cover_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1.png",
    },  

    watchHistory: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Video",
        default: [],
    },

    password: {
        type: String,
        required: [true, "Password is required"],
        lowercase: true,
    },

refreshToken: {
        type: String,
        default: null,
    },


},{timestamps: true});


userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
        this.password = await bcrypt.hash(this.password, 10);
        next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}   


userSchema.genrateAccesssToken = function () {
    return jwt.sign({
         id: this._id,
         fullName: this.fullName,
         userName: this.userName,
         email: this.email
        },
         process.env.ACCESS_TOKEN_SECRET,    
         { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN });
}   
    
userSchema.genrateRefreshToken = function () {
    return jwt.sign({
         id: this._id,
        },
         process.env.REFRESH_TOKEN_SECRET,    
         { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN });
}   
    

export const User = mongoose.model("User", userSchema);