const User = require("../Models/UserModel");


module.exports.updateUserRole = async (req, res, role) => {
    try {
        const userId = req.params.userId;
        console.log('User:', User);
        console.log('userId:', userId);
        console.log('req.params:', req.params);
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        user.role = role;
        await user.save();
        res.status(200).json({ message: `Role updated to ${role} successfully` });
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).json({ message: "Error updating user role", error });
    }
};
