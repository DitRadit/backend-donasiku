const { Item, Request, User, Donation } = require("../models");
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

exports.getRequestItems = async (req, res) => {
  try {
    const requestId = req.params.id;
    const items = await Item.findAll({
      where: { request_id: requestId },
      include: [{ model: User, attributes: ['user_id', 'name', 'email'] }]
    });
    res.json({ success: true, items });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching items", error: err.message });
  }
};

exports.getItemById = async (req, res) => {
  try {
    const itemId = req.params.id;

   const item = await Item.findByPk(itemId, {
  include: [
    { model: User, attributes: ["user_id", "name"] },
    { model: Request, attributes: ["request_id", "message"] }
  ]
});


    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    res.json({ success: true, item });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching item", error: err.message });
  }
};

exports.getMyItems = async (req, res) => {
  try {
    const userId = req.user.user_id; 

    const items = await Item.findAll({
      where: { user_id: userId },
      include: [
        { 
          model: Request, 
          attributes: ["request_id", "message", "status"], 
          required: false 
        }
      ],
      order: [["created_at", "DESC"]] 
    });

    res.json({ success: true, items });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching my items",
      error: err.message
    });
  }
};


exports.updateItemStatusReceiver = async (req, res) => {
  try {
    const receiverId = req.user.user_id; 
    const itemId = req.params.id;
    const { status, quantity } = req.body; 

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const item = await Item.findByPk(itemId, { include: Request });
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });

    if (!item.request_id) {
      return res.status(400).json({ success: false, message: "Item is not linked to any request" });
    }

    const request = await Request.findByPk(item.request_id);
    if (!request) return res.status(404).json({ success: false, message: "Related request not found" });

    if (request.user_id !== receiverId) {
      return res.status(403).json({ success: false, message: "You are not the owner of this request" });
    }

    item.status = status;
    await item.save();
    await request.reload();

    let donation = null;
    if (status === "approved") {

      donation = await Donation.create({
        item_id: item.item_id,
        donor_id: item.user_id,      
        receiver_id: receiverId,      
        quantity: quantity || item.quantity,
         address: request.address,    
    area_id: request.area_id,
        status: "in_progress"
      });

      request.item_id = item.item_id;
      request.status = "fulfilled"; 
      await request.save();
    }

    res.json({
      success: true,
      message: `Item ${status} successfully`,
      item,
      donation,
      request
    });

  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: "Error updating item status", 
      error: err.message 
    });
  }
};
