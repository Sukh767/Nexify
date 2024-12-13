import User from "../../models/user.model.js";

export const getUserDetails = async (req, res) => {
    const { id } = req.user;

    try {
        const user = await User.findById(id).select('-password -isSupreme');
        if (!user) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }

        return res.status(200).json({
            status: "successful",
            data: user,
        });
    } catch (error) {
        console.error("Error fetching user details:", error);
        return res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
};
