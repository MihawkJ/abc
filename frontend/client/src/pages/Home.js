// client/src/pages/Home.js
import React from "react";
import "./Home.css";
import Feed from "../components/Feed";
import Rightbar from "../components/Rightbar";

const Home = ({ user }) => {
  return (
    <div className="home-container">
      <Feed user={user} />
      <Rightbar user={user} />
    </div>
  );
};

export default Home;
