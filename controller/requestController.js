const { Request, User, Item, Category, Area } = require("../models");

exports.createRequest = async (req, res) => {
  try {
    const receiverId = req.user.user_id;
    const { category_id, message, quantity, area_id, address, item_id } = req.body;

    const request = await Request.create({
      user_id: receiverId,   
      category_id,
      message,
      quantity,
      area_id,
      address,
      item_id: item_id || null, 
      status: "open"
    });

    res.status(201).json({
      success: true,
      message: "Request created successfully",
      request
    });
  } catch (err) {
    console.error("createRequest error:", err);
    res.status(500).json({
      success: false,
      message: "Error creating request",
      error: err.message
    });
  }
};

exports.getRequestById = async (req, res) => {
  try {
    const requestId = req.params.id;

    const request = await Request.findByPk(requestId, {
      include: [
        { model: User, attributes: ["user_id", "name", "email", "role"] },
        { model: Category, attributes: ["category_id", "name"] },
        { model: Area, attributes: ["area_id", "area_name"] },
        { model: Item, as: "item", attributes: ["item_id", "name", "image", "status"] }
      ]
    });

    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    const cleanResponse = {
      request_id: request.request_id,
      status: request.status,
      message: request.message,
      quantity: request.quantity,
      created_at: request.created_at,
      address: request.address,
      user: request.user ? {
        user_id: request.user.user_id,
        name: request.user.name,
        email: request.user.email,
        role: request.user.role
      } : null,
      category: request.category ? {
        category_id: request.category.category_id,
        name: request.category.name
      } : null,
      area: request.area ? {
        area_id: request.area.area_id,
        name: request.area.area_name
      } : null,
      item: request.item ? {
        item_id: request.item.item_id,
        name: request.item.name,
        image: request.item.image,
        status: request.item.status
      } : null
    };

    res.json({ success: true, data: cleanResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


exports.getAllRequests = async (req, res) => {
  try {
    const requests = await Request.findAll({
      include: [
        { model: User, attributes: ["user_id", "name", "email", "role"] },
        { model: Category, attributes: ["category_id", "name"] },
        { model: Area, attributes: ["area_id", "area_name"] },
        { model: Item, as: "item", attributes: ["item_id", "name", "image", "status"] }
      ]
    });

    const cleanResponse = requests.map(r => ({
      request_id: r.request_id,
      status: r.status,
      message: r.message,
      quantity: r.quantity,
      created_at: r.created_at,
      address: r.address,
      user: r.user ? {
        user_id: r.user.user_id,
        name: r.user.name,
        email: r.user.email,
        role: r.user.role
      } : null,
      category: r.category ? {
        category_id: r.category.category_id,
        name: r.category.name
      } : null,
      area: r.area ? {
        area_id: r.area.area_id,
        name: r.area.area_name
      } : null,
      item: r.item ? {
        item_id: r.item.item_id,
        name: r.item.name,
        image: r.item.image,
        status: r.item.status
      } : null
    }));

    res.json({ requests: cleanResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getRequestsByUserArea = async (req, res) => {
  try {
    const userId = req.user.user_id; 
    const user = await User.findByPk(userId);

    if (!user || !user.area_id) {
      return res.status(404).json({ message: "User area not found" });
    }

    const requests = await Request.findAll({
      where: { area_id: user.area_id },
      include: [
        { model: User, attributes: ["user_id", "name", "email", "role"] },
        { model: Category, attributes: ["category_id", "name"] },
        { model: Area, attributes: ["area_id", "area_name"] },
        { model: Item, attributes: ["item_id", "name", "image", "status"] }
      ]
    });

    const cleanResponse = requests.map(r => ({
      request_id: r.request_id,
      status: r.status,
      message: r.message,
      quantity: r.quantity,
      created_at: r.created_at,
      address: r.address,
      user: r.user ? {
        user_id: r.user.user_id,
        name: r.user.name,
        email: r.user.email,
        role: r.user.role
      } : null,
      category: r.category ? {
        category_id: r.category.category_id,
        name: r.category.name
      } : null,
      area: r.area ? {
        area_id: r.area.area_id,
        name: r.area.area_name
      } : null,
      item: r.item ? {
        item_id: r.item.item_id,
        name: r.item.name,
        image: r.item.image,
        status: r.item.status
      } : null
    }));

    res.json({ requests: cleanResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
