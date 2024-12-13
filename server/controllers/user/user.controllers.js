
import {sendVerificationEmail, sendWelcomeEmail} from "../../mailtrap/emails.js";
import User from "../../models/user.model.js";
import generateTokenAndSetCookie from "../../utils/generateTokenAndSetCookie.js";


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
        return res.status(400).json({message: "Invalid credentials"})
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

const logoutUser = async (req,res)=>{
    res.clearCookie('token');
    return res.status(200).json({message: "Logout successful"})
}


export {registerUser,loginUser, verifyEmail, logoutUser}