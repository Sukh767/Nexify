
import {sendPasswordResetEmail, sendResetSuccesfulEmail, sendVerificationEmail, sendWelcomeEmail} from "../../mailtrap/emails.js";
import User from "../../models/user.model.js";
import generateTokenAndSetCookie from "../../utils/generateTokenAndSetCookie.js";
import crypto from "crypto";
import bcrypt from "bcrypt";

// Register user
const registerUser = async (req, res) => {
    try {
        const { first_name, last_name, email, mobile, password } = req.body;

        // Validate input fields
        if ([first_name, last_name, email, mobile, password].includes('')) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if the user already exists
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ message: "User already exists, please login" });
        }

        // Generate a verification token
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        // Create the user
        const user = await User.create({
            first_name,
            last_name,
            email,
            mobile,
            password,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        });

        // Fetch the created user without the password field
        const createdUser = await User.findById(user._id).select("-password");

        if (!createdUser) {
            return res.status(400).json({ message: "Something went wrong, please try again" });
        }

        generateTokenAndSetCookie(res, user._id);
        await sendVerificationEmail(user.email, verificationToken);

        return res.status(201).json({ success: true, message: "User created successfully, please login", user:{
            ...user._doc,
            password: null,
        } });

    } catch (error) {
        console.error("Error during user registration:", error);
        res.status(500).json({success: false, message: "Internal Server Error" });
    }
};

//Verify email
const verifyEmail = async(req,res)=>{
    const { code } = req.body;
    console.log(code)
    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() },
        })
        console.log(user)

        if(!user){
            return res.status(400).json({message: "Invalid or expired verification code"})
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;

        await user.save();
        await sendWelcomeEmail(user.email, user.firlst_name);

        return res.status(200).json({success: true, message: "Email verified successfully", user: {...user._doc, password: undefined}})

    } catch (error) {
        res.status(500).json({message: "Internal Server Error"})
        console.error("Error verifying email:", error)
    }
}

//Login user
const loginUser = async (req,res)=>{
    const {email, password} = req.body;

    if([email, password].includes('')){
        return res.status(400).json({message: "All fields are required"})
    }

    const user = await User.findOne({email})

    if(!user){
        return res.status(400).json({message: "User does not exist, please register"})
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password)

    if(!isPasswordCorrect){
        return res.status(400).json({message: "Password is incorrect, please try again"})
    }

    const loggedInUser = await User.findById(user._id).select('-password')

    loggedInUser.last_login = Date.now();
    await loggedInUser.save();

    generateTokenAndSetCookie(res, loggedInUser._id);

    if(!loggedInUser){
        return res.status(400).json({message: "Something went wrong, please try again"})
    }

    return res.status(200).json({message: "Login successful", user: {...loggedInUser._doc, password: undefined}})
}

//Logout user
const logoutUser = async (req,res)=>{
    res.clearCookie('token');
    return res.status(200).json({message: "Logout successful"})
}

//forgot password
const forgotPassword = async (req,res)=>{
    const {email} = req.body;

    if(!email){
        return res.status(400).json({message: "Email is required"})
    }

    try {
        const user = await User.findOne({email})

    if(!user){
        return res.status(400).json({message: "User does not exist, please register"})
    }

    //generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hours

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    //send email

    await sendPasswordResetEmail(user.email, `${process.env.RESET_PASS_CLIENT_URL}/user/reset-password/${resetToken}`);

    return res.status(200).json({success: true, message: "Password reset email sent successfully"})

    } catch (error) {
        console.log("Error sending password reset email:", error)
        return res.status(500).json({success: false, message: "Internal Server Error"})
    }


}

//reset password
const resetPassword = async (req,res)=>{
    const {token} = req.params;
    const {password} = req.body;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() },
        })

        if(!user){
            return res.status(400).json({success:false, message: "Invalid or expired reset token"})
        }

        //update password  - hash the password
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;

        await user.save();

        await sendResetSuccesfulEmail(user.email);

        res.status(200).json({success: true, message: "Password reset successful"})

    } catch (error) {
        
    }
}

// Delete user
const deleteUser = async (req, res) => {
    const { id } = req.params; 

    try {
        // Find the user
        const user = await User.findById(id); 
        console.log(id);

        // Check if the user exists
        if (!user) {
            return res.status(400).json({ success: false, message: "User does not exist" });
        }

        // Delete the user
        await User.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

//Update user details
const updateUserDetails = async (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, DOB, mobile, password } = req.body;

    try {
        const user = await User.findById(id);

        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }

        // Update user fields
        user.first_name = first_name;
        user.last_name = last_name;

        // Parse the DOB field into a Date object
        if (DOB) {
            const parsedDOB = new Date(DOB);
            if (isNaN(parsedDOB)) {
                return res.status(400).json({ message: "Invalid date format for DOB" });
            }
            user.DOB = parsedDOB;
        }

        user.mobile = mobile;
        user.password = password;

        // Save the updated user
        await user.save();

        return res
            .status(200)
            .json({ message: "User details updated successfully", user: { ...user._doc, password: undefined } });
    } catch (error) {
        console.error("Error updating user details:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


export {registerUser,loginUser, verifyEmail, logoutUser, forgotPassword, resetPassword, deleteUser, updateUserDetails}