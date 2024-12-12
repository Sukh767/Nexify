
import {sendVerificationEmail} from "../../mailtrap/emails.js";
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

    if(!loggedInUser){
        return res.status(400).json({message: "Something went wrong, please try again"})
    }

    return res.status(200).json({message: "Login successful", user: loggedInUser})
}

export {registerUser,loginUser}