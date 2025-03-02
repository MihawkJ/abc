const User = require("../models/User");

const followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToFollow || !currentUser) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    if (currentUser.following.includes(userToFollow._id)) {
      currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== userToFollow._id.toString()
      );
      userToFollow.followers = userToFollow.followers.filter(
        (id) => id.toString() !== currentUser._id.toString()
      );
    } else {
      currentUser.following.push(userToFollow._id);
      userToFollow.followers.push(currentUser._id);
    }

    await currentUser.save();
    await userToFollow.save();

    res.json({
      message: "Takip işlemi güncellendi",
      following: currentUser.following,
    });
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

module.exports = { followUser };
