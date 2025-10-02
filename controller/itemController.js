const { Item, Request, User, Donation, Category, Area } = require("../models");
const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinary");


exports.createItem = async (req, res) => {
  try {
    const donorId = req.user.user_id;
    const { name, description, category_id, quantity, area_id, request_id, address} = req.body;

    let image_url = null;
    if (req.file) {
      
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "items" },
        async (error, result) => {
          if (error) return res.status(500).json({ success: false, message: "Image upload failed", error });

          image_url = result.secure_url;

          const item = await Item.create({
            user_id: donorId,
            name,
            description,
            category_id,
            quantity,
            area_id,
            address,
            request_id: request_id || null,
            status: request_id ? "pending" : "available",
            image: image_url
          });
          

          res.status(201).json({ success: true, item });
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    } else {
   
      const item = await Item.create({
        user_id: donorId,
        name,
        description,
        category_id,
        quantity,
        area_id,
        address,
        request_id: request_id || null,
        status: request_id ? "pending" : "available"
      });
      res.status(201).json({ success: true, item });
    }

  } catch (err) {
    res.status(500).json({ success: false, message: "Error creating item", error: err.message });
  }
};
exports.getItemById = async (req, res) => {
  try {
    const itemId = req.params.id;
    const item = await Item.findByPk(itemId, {
      include: [
        { model: User, attributes: ["user_id", "name", "email"] },
        { model: Request, as: "requests", attributes: ["request_id", "message", "status"] }
      ]
    });

    if (!item) return res.status(404).json({ success: false, message: "Item not found" });

    const cleanResponse = {
      item_id: item.item_id,
      name: item.name,
      description: item.description,
      quantity: item.quantity,
      donor: item.user ? { user_id: item.user.user_id, name: item.user.name, email: item.user.email } : null,
      requests: item.requests.map(r => ({ request_id: r.request_id, message: r.message, status: r.status })),
      created_at: item.created_at,
      updated_at: item.updated_at
    };

    res.json({ success: true, data: cleanResponse });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching item", error: err.message });
  }
};



exports.getMyItems = async (req, res) => {
  try {
    const { user_id } = req.user;

    const items = await Item.findAll({
      where: { user_id },
      include: [
        {
          model: Request,
          as: "requests",
          attributes: ["request_id", "message", "status"],
          required: false
        }
      ],
      order: [["created_at", "DESC"]]
    });

    const data = items.map(item => {
      const {
        item_id,
        name,
        description,
        quantity,
        created_at,
        updated_at,
        requests = []
      } = item;

      return {
        item_id,
        name,
        description,
        quantity,
        requests: requests.map(r => ({
          request_id: r.request_id,
          message: r.message,
          status: r.status
        })),
        created_at,
        updated_at
      };
    });

    res.json({
      success: true,
      count: data.length,
      data
    });
  } catch (err) {
    console.error("getMyItems error:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching my items",
      error: err.message
    });
  }
};


exports.approveDonation = async (req, res) => {
  const userId = req.user.user_id; 
  const userRole = req.user.role; 
  const { request_id, item_id } = req.body;

  try {

    const request = await Request.findByPk(request_id);
    const item = await Item.findByPk(item_id);

     if (request.area_id !== item.area_id) {
      return res.status(400).json({ 
        success: false, 
        message: "Request and Item must be in the same area" 
      });
    }

    if (!request || !item) {
      return res.status(404).json({ success: false, message: "Request or item can't be found" });
    }

    if (userRole === "receiver" && request.user_id === userId) {
      if (!item.request_id || item.request_id !== request_id) {
        return res.status(400).json({ success: false, message: "Item didnt mentioned in here" });
      }

      await request.update({ status: "fulfilled", item_id });
      await item.update({ status: "in_progress", request_id });

      const donation = await Donation.create({
        item_id,
        donor_id: item.user_id,
        receiver_id: request.user_id,
        quantity: request.quantity || item.quantity,
        status: "pending",
        address: request.address,
        area_id: request.area_id
      });

      return res.status(201).json({
        success: true,
        message: "Donation created",
        donation
      });
    }

    if (userRole === "donor" && item.user_id === userId) {
      if (!request.item_id || request.item_id !== item_id) {
        return res.status(400).json({ success: false, message: "Request havent been linked in here" });
      }

      await item.update({ status: "in_progress", request_id });
      await request.update({ status: "fulfilled", item_id });

      const donation = await Donation.create({
        item_id,
        donor_id: item.user_id,
        receiver_id: request.user_id,
        quantity: request.quantity || item.quantity,
        status: "pending",
        address: request.address,
        area_id: request.area_id
      });

      return res.status(201).json({
        success: true,
        message: "Donation created",
        donation
      });
    }

    return res.status(403).json({
      success: false,
      message: "You are not allowed to this request"
    });

  } catch (err) {
    console.error("approveDonation error:", err);
    res.status(500).json({
      success: false,
      message: "Error approving donation",
      error: err.message
    });
  }
};

exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.findAll({
      include: [
        { model: User, attributes: ["user_id", "name", "email"] },
        { model: Category, attributes: ["category_id", "name"] },
        { model: Area, attributes: ["area_id", "area_name"] },
        { model: Request, as: "requests", attributes: ["request_id", "message", "status"] } 
      ],
      order: [["created_at", "DESC"]]
    });

    const cleanResponse = items.map(item => ({
      item_id: item.item_id,
      name: item.name,
      description: item.description,
      quantity: item.quantity,
      status: item.status,
      image: item.image,
      address: item.address,
      created_at: item.created_at,
      donor: item.user ? { user_id: item.user.user_id, name: item.user.name, email: item.user.email } : null,
      category: item.category ? { category_id: item.category.category_id, name: item.category.name } : null,
      area: item.area ? { area_id: item.area.area_id, name: item.area.area_name } : null,
      requests: item.requests.map(r => ({ request_id: r.request_id, message: r.message, status: r.status }))
    }));

    res.json({ success: true, count: cleanResponse.length, items: cleanResponse });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching items", error: err.message });
  }
};




exports.getItemsByUserArea = async (req, res) => {
  try {
    const userId = req.user.user_id; 
    const user = await User.findByPk(userId);

    if (!user || !user.area_id) {
      return res.status(404).json({ message: "User area not found" });
    }

    const items = await Item.findAll({
      where: { area_id: user.area_id },
      include: [
        { model: User, as: "user", attributes: ["user_id", "name", "email", "role"] },
        { model: Category, as: "category", attributes: ["category_id", "name"] },
        { model: Area, as: "area", attributes: ["area_id", "area_name"] }
      ],
      order: [["created_at", "DESC"]]
    });

    const cleanResponse = items.map(item => ({
      item_id: item.item_id,
      name: item.name,
      description: item.description,
      image: item.image,
      quantity: item.quantity,
      status: item.status,
      address: item.address,
      created_at: item.created_at,

      donor: item.user ? {
        user_id: item.user.user_id,
        name: item.user.name,
        email: item.user.email,
        role: item.user.role
      } : null,

      category: item.category ? {
        category_id: item.category.category_id,
        name: item.category.name
      } : null,

      area: item.area ? {
        area_id: item.area.area_id,
        name: item.area.area_name
      } : null
    }));

    res.json({
      success: true,
      count: cleanResponse.length,
      items: cleanResponse
    });
  } catch (error) {
    console.error("getItemsByUserArea error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

exports.getItemsByRequestId = async (req, res) => {
  try {
    const requestId = req.params.request_id;

    const items = await Item.findAll({
      where: { request_id: requestId },
      attributes: ["item_id", "name", "description", "image", "quantity", "status", "area_id", "created_at"]
    });

    if (!items.length) {
      return res.status(404).json({ success: false, message: "No items linked to this request" });
    }

    res.json({ success: true, data: items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

