const { json } = require('sequelize');
const { User } = require('../models');
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

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

exports.updateProfile = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const { name, phone, address, area_id } = req.body;
    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (area_id !== undefined) updateData.area_id = area_id;

    if (req.file) {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          folder: "profiles",
          public_id: `user_${req.user.user_id}`,
          overwrite: true
        },
        async (error, result) => {
          if (error) {
            console.error("Cloudinary error:", error);
            return res.status(500).json({ message: "Upload failed", error });
          }

          updateData.profile_url = result.secure_url;

          await User.update(updateData, {
            where: { user_id: req.user.user_id }
          });

          const updatedUser = await User.findByPk(req.user.user_id, {
            attributes: { exclude: ["password"] }
          });

          res.json({ message: "Profile updated successfully", user: updatedUser });
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    } else {
      await User.update(updateData, {
        where: { user_id: req.user.user_id }
      });

      const updatedUser = await User.findByPk(req.user.user_id, {
        attributes: { exclude: ["password"] }
      });

      res.json({ message: "Profile updated successfully", user: updatedUser });
    }
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
