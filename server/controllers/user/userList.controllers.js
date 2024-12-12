import User from "../../models/user.model.js";

const userList = async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        return res.status(200).json({ status: "successful", data: users });
    } catch (error) {
        console.error("Error fetching user list:", error);
        res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
};

export default userList;
