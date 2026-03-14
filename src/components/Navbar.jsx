import React from "react";
import { Link } from "react-router-dom";
import logo from "../images/logo.png";

function Navbar() {
  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        padding: "10px 30px",
        backgroundColor: "#111827",
      }}
    >
      <Link to="/">
        <img
          src={logo}
          alt="WeebVault Logo"
          style={{ height: "45px", cursor: "pointer" }}
        />
      </Link>
    </nav>
  );
}

export default Navbar;