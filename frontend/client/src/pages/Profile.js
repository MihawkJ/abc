import React, { useState, useEffect } from "react";
import axios from "axios";

const Profile = ({ user, currentUser }) => {
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (currentUser && user) {
      setIsFollowing(currentUser.following.includes(user._id));
    }
  }, [currentUser, user]);

  const handleFollow = async () => {
    try {
      await axios.post(
        `/api/users/follow/${user._id}`,
        {},
        { headers: { Authorization: `Bearer ${currentUser.token}` } }
      );
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Takip hatası:", error);
    }
  };

  return (
    <div>
      <h2>{user.username}</h2>
      {currentUser && currentUser._id !== user._id && (
        <button onClick={handleFollow}>
          {isFollowing ? "Takibi Bırak" : "Takip Et"}
        </button>
      )}
    </div>
  );
};

export default Profile;
