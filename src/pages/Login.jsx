import React from "react";
import { useNavigate } from "react-router-dom";
import bg from "../images/bg.jpg";

const Login = () => {
  const navigate = useNavigate(); 

  const handleLogin = () => {
    navigate("/choice");
  };

  return (
    <div
      style={{
        backgroundImage: `url(${bg})`,
        height: "100vh",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <h1
        style={{
          color: "#d8b4ff",
          fontSize: "3.2rem",
          fontWeight: "800",
          letterSpacing: "3px",
          marginBottom: "25px",
          textShadow: "0 0 20px rgba(200,120,255,0.8)"
        }}
      >
        WEEB VAULT
      </h1>
      <div
        style={{
          width: "360px",
          padding: "35px",
          borderRadius: "14px",
          background: "rgba(15,15,25,0.65)",
          backdropFilter: "blur(14px)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 0 30px rgba(0,0,0,0.6)"
        }}
      >
        <input
          className="form-control mb-3"
          placeholder="Enter your email"
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "white"
          }}
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Enter your password"
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "white"
          }}
        />

        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            background: "linear-gradient(135deg,#7c3aed,#a855f7)",
            border: "none",
            padding: "10px",
            borderRadius: "8px",
            color: "white",
            fontWeight: "600"
          }}
        >
          Enter Vault
        </button>
      </div>
    </div>
  );
};

export default Login;