const Role = require("../Models/RoleModel");

module.exports.createRole = async (req, res) => {
    try {
        // validate req.body
        const role = await Role.create(req.body);
        res.status(201).json({ success: true, data: role });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: 'Failed to create role' });
    }
};

module.exports.getRoles = async (req, res) => {
    try {
        const roles = await Role.find();
        res.status(200).json({ success: true, data: roles });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: 'Failed to get roles' });
    }
};

module.exports.updateRole = async (req, res) => {
    try {
        console.log("ID:", req.params.id);
        console.log("Body:", req.body);
        // validate req.body
        const role = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ success: true, data: role });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: 'Failed to update role' });
    }
};


module.exports.deleteRole = async (req, res) => {
    try {
        await Role.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, data: [] });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: 'Failed to delete role' });
    }
};
