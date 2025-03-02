const Post = require("../models/Post");

const createPost = async (req, res) => {
  try {
    const { content, tags } = req.body;
    const author = req.user ? req.user.id : null; // Ensure req.user is defined

    if (!content || !author) {
      return res
        .status(400)
        .json({ message: "Content and author are required" });
    }

    const newPost = new Post({
      content,
      tags,
      author,
      user: author, // Assuming the user field should be the same as author
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ message: "Error creating post", error });
  }
};

module.exports = {
  createPost,
};
