import User from '../../models/user.model.js';


//Register user
const registerUser = async (req,res)=>{
    try {
        const {first_name, last_name, email, mobile, password} = req.body;

        if([first_name, last_name, email, mobile, password].includes('')){
            return res.status(400).json({message: "All fields are required"})
        }

        const userExist = await User.findOne({email})

        if(userExist){
            return res.status(400).json({message: "User already exists, please login"})
        }

        const user = await User.create({
            first_name,
            last_name,
            email,
            mobile,
            password
        })

        const createdUser = await User.findById(user._id).select('-password')

        if(!createdUser){
            return res.status(400).json({message: "Something went wrong, please try again"})
        }

        return res.status(201).json({message: "User created successfully, please login"})

    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"})
    }
}

const loginUser = async (req,res)=>{
    res.send("Login user")
}

export {registerUser,loginUser}