const { Community } = require("../models");

exports.registerCommunity = async (req, res) => {
  try {
    const {
      name,
      short_desc,
      full_desc,
      type,
      location_url,
      area_id,
      location_text,
      founder_name,
      members_count,
      phone
    } = req.body;

    if (!name || !type) {
      return res.status(400).json({ message: "Community name and type are required" });
    }

    const community = await Community.create({
      user_id: req.user.user_id, 
      name,
      short_desc,
      full_desc,
      type,
      location_url,
      area_id,
      location_text,
      founder_name,
      members_count: members_count || 0,
      phone,
      verified: false 
    });

    res.status(201).json({
      message: "Community registered successfully. Please upload verification documents.",
      community
    });
  } catch (err) {
    res.status(500).json({ message: "Error registering community", error: err.message });
  }
};


exports.getMyCommunities = async (req, res) => {
  try {
    const communities = await Community.findAll({
      where: { user_id: req.user.user_id }
    });

    res.json({
      message: "My communities fetched successfully",
      data: communities
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching communities", error: err.message });
  }
};

exports.updateMembersCount = async (req, res) => {
  try {
    const { id } = req.params;
    const { members_count } = req.body;

    if (members_count == null || members_count < 0) {
      return res.status(400).json({ message: "Members count must be a positive integer" });
    }

    const community = await Community.findByPk(id);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    if (req.user.role !== "admin" && community.user_id !== req.user.user_id) {
      return res.status(403).json({ message: "Not authorized to update this community" });
    }

    community.members_count = members_count;
    await community.save();

    res.json({
      message: "Members count updated successfully",
      community
    });
  } catch (err) {
    res.status(500).json({ message: "Error updating members count", error: err.message });
  }
};
