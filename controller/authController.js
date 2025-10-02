
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

let refreshTokens = [];

const generateAccessToken = (user) => {
    return jwt.sign(
        {user_id: user.user_id, username: user.username, role: user.role, area_id: user.area_id },
        process.env.JWT_ACCESS_SECRET,
        {
            expiresIn: '2h'
        }
    );
};

const generateRefreshToken = (user) => {
    const refreshToken = jwt.sign(
        {user_id: user.user_id, username: user.username, role: user.role, area_id: user.area_id },
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn: '7d'
        }
    );
    refreshTokens.push(refreshToken)
    return refreshToken;
};


exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  const { role } = req.params; 

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Username, email, and password are required" });
  }

  if (!["donor", "receiver"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role, 
    });

    const { password: _, ...safeUser } = newUser.toJSON();
    res.status(201).json({ message: "User registered successfully", user: safeUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async(req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ where: { username }});
        if (!user) return res.status(404).json({ message: 'User nor found'});

        const match = await bcrypt.compare(password, user.password);
        if(!match) return res.status(400).json({ message: 'Wrong password'});

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.json({ accessToken, refreshToken });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.refreshToken = (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);
    if (!refreshTokens.includes(token)) return res.sendStatus(403);

    jwt.verify(token, process.env.JWT_REFRESH_SECRET, (error, user) => {
        if (error) return res.sendStatus(403);
        const accessToken = generateAccessToken(user);
        res.json({ accessToken });
    });
};

exports.logout = (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 
    if (!token) return res.sendStatus(401); 

    refreshTokens = refreshTokens.filter(t => t !== token);
    res.json({ message: "Logged out successfully"});
};

