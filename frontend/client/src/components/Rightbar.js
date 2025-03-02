// client/src/components/Rightbar.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Rightbar.css";

const Rightbar = ({ user }) => {
  const [allUsers, setAllUsers] = useState([]);

  const fetchAllUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users");
      setAllUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const handleFollow = async (userId) => {
    if (!user) {
      alert("Takip etmek için önce giriş yapmalısınız.");
      return;
    }
    try {
      // Örnek: /api/follow endpoint'i { followerId, followeeId } beklesin
      await axios.post("http://localhost:5000/api/follow", {
        followerId: user._id,
        followeeId: userId,
      });
      alert("Kullanıcı takip edildi!");
      // Burada user’ın güncellenmiş “following” listesini App.js’de yenileyebilirsiniz.
    } catch (err) {
      console.error(err);
      alert("Takip sırasında hata oluştu");
    }
  };

  // Kendimizi ve zaten takip ettiklerimizi liste dışı bırakabiliriz
  const filteredUsers = allUsers.filter((u) => u._id !== user?._id);

  return (
    <div className="rightbar">
      <div className="who-to-follow">
        <h3>Who to follow</h3>
        {filteredUsers.map((u) => {
          const alreadyFollowing = user?.following?.includes(u._id);
          return (
            <div className="follow-item" key={u._id}>
              <div className="follow-info">
                <strong>{u.username}</strong>
                <span>@{u.username}</span>
              </div>
              {!alreadyFollowing ? (
                <button onClick={() => handleFollow(u._id)}>Follow</button>
              ) : (
                <button disabled>Following</button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Rightbar;
