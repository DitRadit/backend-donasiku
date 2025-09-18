const { Request, User, Item, Category, Area } = require("../models");

exports.createRequest = async (req, res) => {
  try {
    const receiverId = req.user.user_id;
    const { category_id, message, quantity, area_id, address } = req.body;

    const request = await Request.create({
      user_id: receiverId,
      category_id,
      message,
      quantity,
      area_id,
      address,
      status: "open"
    });

    res.status(201).json({ success: true, request });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: "Error creating request", 
      error: err.message 
    });
  }
};

exports.getRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await Request.findByPk(id, {
      include: [
        { model: User, attributes: ["user_id", "name", "email"] },
        { model: Area, attributes: ["area_id", "area_name"] },
        { model: Category, attributes: ["category_id", "name"] }
      ]
    });

    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    res.json({ success: true, request });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



exports.getAllRequests = async (req, res) => {
  try {
    const requests = await Request.findAll({
      include: [
        { model: User, attributes: ["user_id", "name"] },
        { model: Category, attributes: ["category_id", "name"] },
        { model: Area, attributes: ["area_id", "area_name"] }
      ]
    });
    res.json({ success: true, requests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};