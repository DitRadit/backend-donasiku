const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const { Op } = require("sequelize");
const { Document, User, Community } = require("../models");

// Upload dokumen untuk user
exports.uploadUserDocument = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        folder: "documents/users",
      },
      async (error, result) => {
        if (error) return res.status(500).json({ message: "Upload failed", error });

        const doc = await Document.create({
          user_id: req.user.user_id,
          community_id: null,
          title: req.body.title || req.file.originalname,
          file_url: result.secure_url,
          status: "pending"
        });

        res.status(201).json({
          message: "User document uploaded successfully",
          document: doc,
        });
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Upload dokumen untuk community
exports.uploadCommunityDocument = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const community = await Community.findOne({
      where: { community_id: req.body.community_id, user_id: req.user.user_id }
    });
    if (!community) return res.status(403).json({ message: "Not authorized for this community" });

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        folder: "documents/communities",
      },
      async (error, result) => {
        if (error) return res.status(500).json({ message: "Upload failed", error });

        const doc = await Document.create({
          user_id: null,
          community_id: req.body.community_id,
          title: req.body.title || req.file.originalname,
          file_url: result.secure_url,
          status: "pending"
        });

        res.status(201).json({
          message: "Community document uploaded successfully",
          document: doc,
        });
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ==================== USER SIDE ====================
// Ambil dokumen milik user yang sedang login
exports.getMyDocuments = async (req, res) => {
  try {
    const docs = await Document.findAll({
      where: { user_id: req.user.user_id }
    });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching my documents", error: err.message });
  }
};

exports.downloadDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const doc = await Document.findByPk(id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    if (req.user.role !== "admin" && doc.user_id !== req.user.user_id) {
      return res.status(403).json({ message: "Not authorized to access this document" });
    }

    const downloadUrl = doc.file_url.replace("/upload/", "/upload/fl_attachment/");

    res.json({
      message: "Download link generated",
      downloadUrl
    });

  } catch (err) {
    res.status(500).json({ message: "Error downloading document", error: err.message });
  }
};


// ==================== ADMIN SIDE ====================
exports.getUserDocuments = async (req, res) => {
  try {
    const { role } = req.query;

    const userWhere = {};
    if (role) {
      userWhere.role = role;
    }

    const docs = await Document.findAll({
      where: { community_id: null },
      include: [
        {
          model: User,
          attributes: ["user_id", "name", "role", "verified"],
          where: Object.keys(userWhere).length ? userWhere : undefined
        }
      ]
    });

    res.json(docs);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching user documents",
      error: err.message
    });
  }
};


exports.getCommunityDocuments = async (req, res) => {
  try {
    const docs = await Document.findAll({
      where: { community_id: { [Op.ne]: null } },
      include: [
        { model: Community, attributes: ["community_id", "name", "type", "verified"] }
      ]
    });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching community documents", error: err.message });
  }
};

exports.verifyDocument = async (req, res) => {
  try {
    const { id } = req.params;      
    const { status, reason } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be approved or rejected" });
    }

    const doc = await Document.findByPk(id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    doc.status = status;
    if (status === "rejected" && reason) {
      doc.rejection_reason = reason; 
    }
    await doc.save();

    if (status === "approved") {
      if (doc.user_id) {
        await User.update({ verified: true }, { where: { user_id: doc.user_id } });
      }
      if (doc.community_id) {
        await Community.update({ verified: true }, { where: { community_id: doc.community_id } });
      }
    }

    res.json({
      message: `Document ${status} successfully`,
      document: doc
    });

  } catch (err) {
    res.status(500).json({ message: "Error verifying document", error: err.message });
  }
};