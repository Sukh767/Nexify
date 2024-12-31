import User from "../../models/user.model.js";

export const updateUserStatus = async (req, res) => {
    //const { id } = req.params;
    const { status, id } = req.body;

    try {
        const user = await User.findById(id);

        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }

        user.status = status;

        await user.save();

        return res
            .status(200)
            .json({ success:true, message: "User status updated successfully"});

    } catch (error) {
        console.error("Error updating user status:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const updateUserRole = async (req, res) => {
    const { isAdmin, id } = req.body;
    console.log("isAdmin:", isAdmin);
  
    try {
      const user = await User.findById(id);
  
      if (!user) {
        return res.status(400).json({ message: "User does not exist" });
      }
  
      // Check if the new role is the same as the current role
      if (user.isAdmin === isAdmin) {
        return res.status(400).json({ message: "User role is already set to this value" });
      }
  
      // Update the user's role
      user.isAdmin = isAdmin;
    //   console.log("Updated user isAdmin:", user.isAdmin);
  
      await user.save();
  
      return res.status(200).json({ success: true, message: "User role updated successfully" });
    } catch (error) {
      console.error("Error updating user role:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  