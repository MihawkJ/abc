// client/src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import "./App.css"; // Opsiyonel, genel stiller için

function App() {
  // user: giriş yapmış kullanıcı bilgileri (ör. { _id, username, following: [...] })
  const [user, setUser] = useState(null);

  return (
    <Router>
      <div className="app-layout">
        {/* Soldaki menü (Sidebar) */}
        <Sidebar user={user} setUser={setUser} />

        {/* Orta sütunda sayfalar (Routes) */}
        <div className="app-content">
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile user={user} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
