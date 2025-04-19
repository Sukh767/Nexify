import { uploadOnCloudinary } from "../../lib/cloudinary.js";
import {
  sendPasswordResetEmail,
  sendResetSuccesfullEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../../mailtrap/emails.js";
import User from "../../models/user.model.js";
import { generateTokensAndSetCookies } from "../../utils/generateTokenAndSetCookie.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";

// Register user
const registerUser = async (req, res) => {
  try {
    const { first_name, last_name, email, mobile, password } = req.body;

    // Validate input fields
    if ([first_name, last_name, email, mobile, password].includes("")) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the user already exists
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res
        .status(400)
        .json({ message: "User already exists, please login" });
    }

    // Generate a verification token
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

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
      return res
        .status(400)
        .json({ message: "Something went wrong, please try again" });
    }

    generateTokensAndSetCookies(res, user._id);
    await sendVerificationEmail(user.email, verificationToken);

    return res.status(201).json({
      success: true,
      message: "User created successfully, please login",
      user: {
        ...user._doc,
        password: null,
      },
    });
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

//Verify email
const verifyEmail = async (req, res) => {
  const { code } = req.body;
  console.log(code);
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });
    console.log(user);

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification code" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;

    await user.save();
    await sendWelcomeEmail(user.email, user.firlst_name);

    return res
      .status(200)
      .json({
        success: true,
        message: "Email verified successfully",
        user: { ...user._doc, password: undefined },
      });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.error("Error verifying email:", error);
  }
};

//Login Admin
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  if ([email, password].includes("")) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res
      .status(400)
      .json({ message: "User does not exist, please register" });
  }

  if (!user.isAdmin) {
    return res
      .status(400)
      .json({ success:false, message: "You are not authorized to login as an admin" });
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    return res
      .status(400)
      .json({ message: "Password is incorrect, please try again" });
  }

  const loggedInUser = await User.findById(user._id).select("-password");

  if (!loggedInUser) {
    return res
      .status(400)
      .json({ message: "Something went wrong, please try again" });
  }

  loggedInUser.last_login = Date.now();
  await loggedInUser.save();

  const { accessToken, refreshToken } = generateTokensAndSetCookies(
    res,
    loggedInUser._id
  );

  return res
    .status(200)
    .json({
      success:true,
      message: "Login successful",
      user: { ...loggedInUser._doc, password: undefined, accessToken },
    });
};

//Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if ([email, password].includes("")) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res
      .status(400)
      .json({ message: "User does not exist, please register" });
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    return res
      .status(400)
      .json({ message: "Password is incorrect, please try again" });
  }

  const loggedInUser = await User.findById(user._id).select("-password");

  if (!loggedInUser) {
    return res
      .status(400)
      .json({ message: "Something went wrong, please try again" });
  }

  loggedInUser.last_login = Date.now();
  await loggedInUser.save();

  const { accessToken, refreshToken } = generateTokensAndSetCookies(
    res,
    loggedInUser._id
  );

  return res
    .status(200)
    .json({
      success:true,
      message: "Login successful",
      user: { ...loggedInUser._doc, password: undefined, accessToken },
    });
};

//Logout user
const logoutUser = async (req, res) => {
  res.clearCookie("refreshToken");
  return res.status(200).json({ success:true ,message: "Logout successful" });
};

//Refresh token
const generateRefreshToken = async (req, res) => {
    const { refreshToken } = req.cookies;
  
    if (!refreshToken) {
      return res.status(403).json({ message: "No refresh token provided" });
    }
  
    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(403).json({ message: "User not found" });
      }
  
      const accessToken = jwt.sign(
        { userId: user._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30m" }
      );
  
      return res.status(200).json({ accessToken });
    } catch (err) {
      console.error(err.message);
      return res.status(403).json({ message: "Invalid or expired refresh token" });
    }
};  

//forgot password
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ message: "User does not exist, please register" });
    }

    //generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hours

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    //send email

    await sendPasswordResetEmail(
      user.email,
      `${process.env.RESET_PASS_CLIENT_URL}/user/reset-password/${resetToken}`
    );

    return res
      .status(200)
      .json({
        success: true,
        message: "Password reset email sent successfully",
      });
  } catch (error) {
    console.log("Error sending password reset email:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

//reset password
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    //TODO: check first old password matching with the user password or not

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
    }

    //update password  - hash the password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;

    await user.save();

    await sendResetSuccesfullEmail(user.email);

    res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (error) {}
};

// Delete user
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the user
    const user = await User.findById(id);
    console.log(id);

    // Check if the user exists
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User does not exist" });
    }

    // Delete the user
    await User.findByIdAndDelete(id);

    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

//Update user details
const updateUserDetails = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, DOB, mobile, status } = req.body;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    // Update user fields
    user.first_name = first_name;
    user.last_name = last_name;
    user.status = status;

    // Parse the DOB field into a Date object
    if (DOB) {
      const parsedDOB = new Date(DOB);
      if (isNaN(parsedDOB)) {
        return res.status(400).json({ message: "Invalid date format for DOB" });
      }
      user.DOB = parsedDOB;
    }

    user.mobile = mobile;
    //user.password = password;

    // Save the updated user
    await user.save();

    return res
      .status(200)
      .json({
        success: true,
        message: "User details updated successfully",
        data: { ...user._doc},
      });
  } catch (error) {
    console.error("Error updating user details:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//Set new password
const setNewPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userFromToken = req.user;

  if (!oldPassword || !newPassword) {
    return res
      .status(400)
      .json({ success: false, message: "Both old and new passwords are required." });
  }

  try {
    // Fetch the user from the database
    const user = await User.findById(userFromToken._id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found or invalid token." });
    }

    // Check if the old password is correct
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ success: false, message: "Old password is incorrect." });
    }

    // Update the password
    user.password = newPassword;
    await user.save();

    // Send email notification (optional)
    //await sendResetSuccesfulEmail(user.email);

    // Respond with success
    res.status(200).json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    console.error("Error in setNewPassword:", error);
    res
      .status(500)
      .json({ success: false, message: "Internal server error. Please try again later." });
  }
};

//set update profile
const uploadProfilePhoto = async (req, res) => {
  try {
    const { _id } = req.user;

    if (!_id) {
      return res.status(404).json({
        success: false,
        message: "Something went wrong. User not found.",
      });
    }

    // Check if files exist
    if (!req.files?.profilePic || req.files.profilePic.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Profile photo is required.",
      });
    }

    const localImagePath = req.files.profilePic[0].path;

    if (!localImagePath) {
      return res.status(400).json({
        success: false,
        message: "Profile photo is required.",
      });
    }

    // Upload the photo to Cloudinary
    let profilePic;
    try {
      const profilePicUpload = await uploadOnCloudinary(localImagePath, "profilePic");
      profilePic = {
        public_id: profilePicUpload.public_id,
        url: profilePicUpload.secure_url,
      };
    } catch (error) { 
      console.error("Error uploading profile photo to Cloudinary:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to upload profile photo.",
        error: error.message,
      });
    }

    // Find the user and update their profile picture
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Delete the old profile picture from Cloudinary if it exists
    if (user.profilePic?.public_id) {
      try {
        await deleteFromCloudinary(user.profilePic.public_id);
      } catch (error) {
        console.error("Error deleting old profile photo:", error);
      }
    }

    // Update the user's profile picture
    user.profilePic = profilePic;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile photo uploaded successfully.",
      data: {
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    console.error("Error in uploadProfilePhoto:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};


export {
  registerUser,
  loginUser,
  verifyEmail,
  logoutUser,
  forgotPassword,
  resetPassword,
  deleteUser,
  updateUserDetails,
  generateRefreshToken,
  setNewPassword,
  loginAdmin,
  uploadProfilePhoto
};
