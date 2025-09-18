const axios = require("axios");
const { Area } = require("../models");

exports.seedProvinces = async (req, res) => {
  try {
    const response = await axios.get("https://emsifa.github.io/api-wilayah-indonesia/api/provinces.json");
    const provinces = response.data;

    for (const prov of provinces) {
      const exists = await Area.findOne({ where: { area_name: prov.name } });
      if (!exists) {
        await Area.create({ area_name: prov.name });
      }
    }

    res.json({ message: "Provinces seeded successfully", count: provinces.length });
  } catch (err) {
    res.status(500).json({ message: "Error seeding provinces", error: err.message });
  }
};

exports.getAreas = async (req, res) => {
  try {
    const areas = await Area.findAll();
    res.json(areas);
  } catch (err) {
    res.status(500).json({ message: "Error fetching areas", error: err.message });
  }
};
