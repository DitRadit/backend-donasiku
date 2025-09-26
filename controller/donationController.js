const { Donation, Request, Item, User, DonationLog } = require("../models");
const { Op } = require("sequelize");

exports.getActiveDonations = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const donations = await Donation.findAll({
      where: {
       status: { [Op.in]: ["pending", "in_progress"] },
        [Op.or]: [{ donor_id: userId }, { receiver_id: userId }]
      },
      include: [
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

    for (let d of donations) {
      if (d.item_id) {
        const item = await Item.findByPk(d.item_id);
        d.Item = item || null; 
      }
    }

    const cleanResponse = donations.map(donation => ({
      donation_id: donation.donation_id,
      status: donation.status,
      donation_date: donation.donation_date,
      donor: donation.Donor ? {
        id: donation.Donor.user_id,
        name: donation.Donor.name,
        email: donation.Donor.email,
        phone: donation.Donor.phone,
        address: donation.Donor.address,
        area_id: donation.Donor.area_id
      } : null,
      receiver: donation.Receiver ? {
        id: donation.Receiver.user_id,
        name: donation.Receiver.name,
        email: donation.Receiver.email,
        phone: donation.Receiver.phone,
        address: donation.Receiver.address,
        area_id: donation.Receiver.area_id
      } : null,
      item: donation.Item ? {
        item_id: donation.Item.item_id,
        name: donation.Item.name,
        description: donation.Item.description,
        image: donation.Item.image,
        quantity: donation.Item.quantity,
        area_id: donation.Item.area_id,
        created_at: donation.Item.created_at
      } : null,
      created_at: donation.createdAt,
      updated_at: donation.updatedAt
    }));

    res.json({ success: true, data: cleanResponse });

  } catch (err) {
    console.error("getActiveDonations error:", err);
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
      where: { donation_id: donationId },
      include: [
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

    let item = null;
    if (donation.item_id) {
      item = await Item.findByPk(donation.item_id, {
        attributes: ["item_id", "name", "description", "image", "quantity", "area_id", "created_at"]
      });
    }

    const cleanResponse = {
      donation_id: donation.donation_id,
      status: donation.status,
      donation_date: donation.donation_date,
      donor: donation.Donor ? {
        id: donation.Donor.user_id,
        name: donation.Donor.name,
        email: donation.Donor.email,
        phone: donation.Donor.phone,
        address: donation.Donor.address,
        area_id: donation.Donor.area_id
      } : null,
      receiver: donation.Receiver ? {
        id: donation.Receiver.user_id,
        name: donation.Receiver.name,
        email: donation.Receiver.email,
        phone: donation.Receiver.phone,
        address: donation.Receiver.address,
        area_id: donation.Receiver.area_id
      } : null,
      item: item ? {
        item_id: item.item_id,
        name: item.name,
        description: item.description,
        image: item.image,
        quantity: item.quantity,
        area_id: item.area_id,
        created_at: item.created_at
      } : null,
      created_at: donation.createdAt,
      updated_at: donation.updatedAt
    };

    res.json({ success: true, data: cleanResponse });

  } catch (err) {
    console.error("getDonationById error:", err);
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
    const { status, note } = req.body;
    

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

    const oldStatus = donation.status;
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

        await DonationLog.create({
      donation_id: donation.donation_id,
      user_id: userId,
      old_status: oldStatus,
      new_status: status,
      note: note || null,
    });

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


exports.getDonationLogs = async (req, res) => {
  try {
    const donationId = req.params.id;

    const logs = await DonationLog.findAll({
      where: { donation_id: donationId },
      include: [
        {
          model: User,
          attributes: ["user_id", "name", "email"],
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    res.json({
      success: true,
      data: logs.map(log => ({
        log_id: log.log_id,
        donation_id: log.donation_id,
        old_status: log.old_status,
        new_status: log.new_status,
        note: log.note,
        user: log.User ? {
          id: log.User.user_id,
          name: log.User.name,
          email: log.User.email,
        } : null,
        created_at: log.createdAt,
      })),
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching donation logs",
      error: err.message,
    });
  }
};


exports.getDonationLogsByDonationId = async (req, res) => {
  try {
    const { donationId } = req.params;

    const logs = await DonationLog.findAll({
      where: { donation_id: donationId },
      include: [
        {
          model: User,
          attributes: ["user_id", "name", "email", "role"],
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    if (!logs || logs.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No logs found for this donation",
      });
    }

    res.json({
      success: true,
      donation_id: donationId,
      logs: logs.map(log => ({
        log_id: log.log_id,
        old_status: log.old_status,
        new_status: log.new_status,
        note: log.note,
        changed_by: log.User
          ? {
              id: log.User.user_id,
              name: log.User.name,
              email: log.User.email,
              role: log.User.role,
            }
          : null,
        created_at: log.createdAt,
      })),
    });
  } catch (err) {
    console.error("getDonationLogsByDonationId error:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching donation logs",
      error: err.message,
    });
  }
};

