const { json } = require('sequelize');
const { User } = require('../models')

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findOne({
            where: { user_id: req.user.user_id },
            attributes: { exclude: ['password'] } 
        });
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const user = await User.findAll();
        res.json(user);
    } catch (error) {
        res.status(500).json({message:"Error Fetching Users", error: error.message})
    }
}