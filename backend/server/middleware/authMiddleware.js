const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const verifyToken = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      return res
        .status(401)
        .json({ message: "Yetkilendirme başarısız, token eksik" });
    }

    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET
    );
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    res.status(401).json({ message: "Geçersiz token" });
  }
};

module.exports = { verifyToken };
