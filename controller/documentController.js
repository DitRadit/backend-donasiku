const cloudinary = require("../config/cloudinary");
const { Document } = require("../models");
const streamifier = require("streamifier");

exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto", // biar pdf juga bisa
        folder: "documents",
      },
      async (error, result) => {
        if (error) return res.status(500).json({ message: "Upload failed", error });
        
        const doc = await Document.create({
          user_id: req.user.user_id,   
          title: req.body.title || req.file.originalname,
          file_url: result.secure_url,
          status: "uploaded",
        });

        res.status(201).json({
          message: "Document uploaded successfully",
          document: doc,
        });
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);

  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.getDocuments = async (req, res) => {
  try {
    const docs = await Document.findAll({
      where: { user_id: req.user.user_id },  
    });
    res.json(docs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching documents", error: error.message });
  }
};
