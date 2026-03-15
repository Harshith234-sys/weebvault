import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../images/logo.png";

function Navbar() {
  const [openProfile, setOpenProfile] = useState(false);

  return (
    <>
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 40px",
          background: "#111827",
          color: "white",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
          <Link to="/">
            <img src={logo} alt="logo" style={{ height: "45px" }} />
          </Link>

          <Link to="/Animelist" style={{ color: "white", textDecoration: "none" }}>
            Anime List
          </Link>

          <Link to="/Mangalist" style={{ color: "white", textDecoration: "none" }}>
            Manga List
          </Link>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <input
            type="text"
            placeholder="Search..."
            style={{
              padding: "6px 10px",
              borderRadius: "6px",
              border: "none",
            }}
          />
          <div
            onClick={() => setOpenProfile(!openProfile)}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "#ff4d6d",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            H
          </div>
        </div>
      </nav>

      {/* Profile Popup */}
      {openProfile && (
        <div
          style={{
            position: "fixed",
            top: "80px",
            right: "40px",
            width: "300px",
            background: "#1f2937",
            padding: "20px",
            borderRadius: "10px",
            color: "white",
            boxShadow: "0px 0px 10px rgba(0,0,0,0.5)",
          }}
        >
          <h3>Profile</h3>
          <p>Username: Harshith</p>
          <p>Anime watched: 0</p>
          <p>Manga read: 0</p>

          <button
            style={{
              marginTop: "10px",
              padding: "6px 10px",
              border: "none",
              borderRadius: "6px",
              background: "#ff4d6d",
              color: "white",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      )}
    </>
  );
}

export default Navbar;