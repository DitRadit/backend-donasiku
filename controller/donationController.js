const { Donation, Request, Item, User, Category, Area } = require("../models");
const { Op } = require("sequelize");

exports.getActiveDonations = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const donations = await Donation.findAll({
      where: {
        status: "in_progress", 
        [Op.or]: [
          { donor_id: userId },
          { receiver_id: userId }
        ]
      },
      include: [
        {
          model: Item,
          attributes: [
            "item_id",
            "name",
            "description",
            "image",
            "quantity",
            "area_id",
            "created_at"
          ]
        },
        {
          model: User,
          as: "Donor",
          attributes: ["user_id", "name", "email", "phone", "address", "area_id"]
        },
        {
          model: User,
          as: "Receiver",
          attributes: ["user_id", "name", "email", "phone", "address", "area_id"]
        }
      ],
      order: [["donation_date", "DESC"]]
    });

    res.json({
      success: true,
      donations
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching active donations",
      error: err.message
    });
  }
};

exports.getDonationById = async (req, res) => {
  try {
    const userId = req.user.user_id; 
    const donationId = req.params.id;

    const donation = await Donation.findOne({
      where: {
        donation_id: donationId
      },
      include: [
        {
          model: Item,
          attributes: [
            "item_id",
            "name",
            "description",
            "image",
            "quantity",
            "area_id",
            "created_at"
          ]
        },
        {
          model: User,
          as: "Donor",
          attributes: ["user_id", "name", "email", "phone", "address", "area_id"]
        },
        {
          model: User,
          as: "Receiver",
          attributes: ["user_id", "name", "email", "phone", "address", "area_id"]
        }
      ]
    });

    if (!donation) {
      return res.status(404).json({ success: false, message: "Donation not found" });
    }

    if (donation.donor_id !== userId && donation.receiver_id !== userId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    res.json({
      success: true,
      donation
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching donation",
      error: err.message
    });
  }
};

exports.updateDonationStatus = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const donationId = req.params.id;
    const { status } = req.body;

    const validStatuses = ["in_progress", "shipped", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid donation status" });
    }

    const donation = await Donation.findByPk(donationId);
    if (!donation) return res.status(404).json({ success: false, message: "Donation not found" });

    const isDonor = donation.donor_id === userId;
    const isReceiver = donation.receiver_id === userId;
    if (!isDonor && !isReceiver) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    if (isDonor && !["in_progress", "shipped", "cancelled"].includes(status)) {
      return res.status(403).json({ success: false, message: "Donor cannot set this status" });
    }
    if (isReceiver && !["completed", "cancelled", "shipped"].includes(status)) {
      return res.status(403).json({ success: false, message: "Receiver cannot set this status" });
    }

    donation.status = status;

    if (isReceiver && ["shipped", "completed", "cancelled"].includes(status)) {
      donation.confirmed_by_receiver = true;
    }

    await donation.save();

    let item = await Item.findByPk(donation.item_id);
    if (item) {
      if (status === "cancelled") {
        item.status = "available";
      } else if (status === "completed") {
        item.status = "donated";
      } else {
        item.status = status;
      }
      await item.save();
    }

    let request = null;
    if (donation.receiver_id) {
      request = await Request.findOne({ where: { item_id: donation.item_id } });
      if (request) {
        if (status === "completed") {
          request.status = "fulfilled";
        } else if (status === "cancelled") {
          request.status = "open";
          request.item_id = null;
        }
        await request.save();
      }
    }

    res.json({
      success: true,
      message: `Donation status updated to ${status}`,
      donation,
      item,
      request
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error updating donation status",
      error: err.message,
    });
  }
};


