import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bg from "../images/bg.jpg";

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            alert("Please enter email and password");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Login failed");
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            navigate("/choice");

        } catch (error) {
            console.error("Login error:", error);
            alert("Unable to connect to server");
        } finally {
            setLoading(false);
        }
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
                <form onSubmit={handleLogin}>

                    <input
                        type="email"
                        className="form-control mb-3"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                            background: "rgba(255,255,255,0.08)",
                            border: "1px solid rgba(255,255,255,0.15)",
                            color: "white"
                        }}
                    />

                    <button
                        type="submit"
                        disabled={loading}
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
                        {loading ? "Entering..." : "Enter Vault"}
                    </button>

                </form>
            </div>
        </div>
    );
};

export default Login;

