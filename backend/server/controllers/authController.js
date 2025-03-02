const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Kullanıcı Kaydı
const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Kullanıcı adı ve şifre gereklidir." });
    }

    const userExists = await User.findOne({ username });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "Bu kullanıcı adı zaten kullanılıyor." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });

    await newUser.save();

    res.status(201).json({ message: "Kayıt başarılı!", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Kayıt sırasında hata oluştu.", error });
  }
};
