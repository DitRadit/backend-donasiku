const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { users } = require('../models/userModel');
const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, password, role, email, name, phone, address, area_id } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await users.create({
            username,
            password: hashedPassword,
            role,
            email,
            name,
            phone,
            address,
            area_id
        });
        const { password: _, ...safeUser } = newUser.toJson();
        res.json({ message: 'User registered successfully', user: safeUser});
    } catch (error) {
        res.status(500).json({ message: err.message });
    }
});