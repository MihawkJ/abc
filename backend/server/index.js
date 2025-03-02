require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

// MongoDB bağlantısı
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// ### MODELLER ###

// Kullanıcı şeması
// - username (unique)
// - password (bcrypt ile hashlenmiş)
// - following (takip edilen kullanıcıların _id'lerini tutar)
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const User = require("./models/User");
const Post = require("./models/Post");

// Post şeması
// - text (içerik)
// - user (postu oluşturan kullanıcının _id'si)
// - createdAt (otomatik tarih)
const postSchema = new mongoose.Schema({
  text: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

// ### ENDPOINT'LER ###

// 1. Kayıt (Register)
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    // Kullanıcı adı daha önce alınmış mı?
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Kullanıcı adı zaten alınmış." });
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.json({ message: "Kayıt başarılı" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

// 2. Giriş (Login)
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    // Kullanıcı var mı?
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: "Kullanıcı bulunamadı." });
    }

    // Şifre eşleşiyor mu?
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Şifre hatalı." });
    }

    // JWT token oluştur
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Kullanıcı bilgilerini (takip listesi dahil) dön
    const userData = await User.findById(user._id).populate(
      "following",
      "username"
    );
    res.json({
      token,
      user: {
        _id: userData._id,
        username: userData.username,
        following: userData.following,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

// 3. Tüm kullanıcıları listele (Who to follow için)
app.get("/api/users", async (req, res) => {
  try {
    // Şifre hariç tüm kullanıcıları dön
    // "following" alanını da populate edebilirsiniz
    const users = await User.find({}, { password: 0 }).populate(
      "following",
      "username"
    );
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

// 4. Takip Et (Follow)
app.post("/api/follow", async (req, res) => {
  const { followerId, followeeId } = req.body;
  try {
    // followerId'ye sahip kullanıcıyı bul
    const follower = await User.findById(followerId);
    if (!follower) {
      return res
        .status(400)
        .json({ error: "Takip eden kullanıcı bulunamadı." });
    }

    // followeeId'ye sahip kullanıcı var mı?
    const followee = await User.findById(followeeId);
    if (!followee) {
      return res
        .status(400)
        .json({ error: "Takip edilecek kullanıcı bulunamadı." });
    }

    // Zaten takip ediyor mu?
    if (follower.following.includes(followeeId)) {
      return res.status(400).json({ error: "Zaten takip ediliyor." });
    }

    // followeeId'yi follower'ın following listesine ekle
    follower.following.push(followeeId);
    await follower.save();

    res.json({ message: "Takip edildi." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

// 5. Tüm postları listele
app.get("/api/posts", async (req, res) => {
  try {
    // En yeni post en üstte gözüksün
    const posts = await Post.find()
      .populate("user", "username")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

// Sunucuyu başlat
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
