// client/src/components/Feed.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Feed.css";

const Feed = ({ user }) => {
  const [feedType, setFeedType] = useState("forYou");
  const [posts, setPosts] = useState([]);
  const [postText, setPostText] = useState("");

  // Postları API'den çek
  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/posts");
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Post Oluştur
  const handlePostSubmit = async () => {
    if (!user) {
      alert("Post atmak için önce giriş yapmalısınız!");
      return;
    }
    if (!postText.trim()) return;

    try {
      const token = user.token; // Örnek: user objesinde token saklıyorsanız
      const res = await axios.post("http://localhost:5000/api/posts", {
        text: postText,
        token,
      });
      alert(res.data.message);
      setPostText("");
      fetchPosts(); // Yeni post eklendikten sonra listeyi güncelle
    } catch (err) {
      console.error(err);
      alert("Post atılırken hata oluştu");
    }
  };

  // feedType 'following' ise sadece takip edilen kullanıcıların postlarını göster
  const displayedPosts =
    feedType === "following"
      ? posts.filter((p) => user?.following?.includes(p.user?._id)) // Optional chaining kullanıldı
      : posts;

  return (
    <div className="feed-container">
      <div className="feed-tabs">
        <div
          className={`feed-tab ${feedType === "forYou" ? "active" : ""}`}
          onClick={() => setFeedType("forYou")}
        >
          For you
        </div>
        <div
          className={`feed-tab ${feedType === "following" ? "active" : ""}`}
          onClick={() => setFeedType("following")}
        >
          Following
        </div>
      </div>

      {/* Post oluşturma alanı */}
      <div className="post-create">
        <textarea
          placeholder="What's happening?"
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
        />
        <button onClick={handlePostSubmit}>Post</button>
      </div>

      {/* Post listesi */}
      <div className="post-list">
        {displayedPosts.map((post) => (
          <div key={post._id} className="post-item">
            <strong>{post.user.username}</strong>
            <p>{post.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feed;
