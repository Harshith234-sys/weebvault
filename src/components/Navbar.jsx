import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../images/logo.png";
import { getLibrary } from "../services/api";

function Navbar() {
    const [openProfile, setOpenProfile] = useState(false);
    const [library, setLibrary] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLibrary = async () => {
            const token = localStorage.getItem("token");

            if (!token) return;

            try {
                const data = await getLibrary();
                setLibrary(data.library || []);
            } catch (error) {
                console.error("Profile library error:", error);
            }
        };

        fetchLibrary();
    }, []);

    const animeEntries = library.filter(
        (item) => item.type === "anime"
    );

    const mangaEntries = library.filter(
        (item) => item.type === "manga"
    );

    const animeWatching = animeEntries.filter(
        (item) => item.status === "watching"
    ).length;

    const animeCompleted = animeEntries.filter(
        (item) => item.status === "completed"
    ).length;

    const mangaReading = mangaEntries.filter(
        (item) => item.status === "reading"
    ).length;

    const mangaCompleted = mangaEntries.filter(
        (item) => item.status === "completed"
    ).length;

    const handleLogout = () => {
        localStorage.removeItem("token");
        setLibrary([]);
        setOpenProfile(false);
        navigate("/");
    };

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
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "30px",
                    }}
                >
                    <Link to="/">
                        <img
                            src={logo}
                            alt="logo"
                            style={{ height: "45px" }}
                        />
                    </Link>

                    <Link
                        to="/Animelist"
                        style={{
                            color: "white",
                            textDecoration: "none",
                        }}
                    >
                        Anime List
                    </Link>

                    <Link
                        to="/Mangalist"
                        style={{
                            color: "white",
                            textDecoration: "none",
                        }}
                    >
                        Manga List
                    </Link>
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "20px",
                    }}
                >
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
                        onClick={() =>
                            setOpenProfile(!openProfile)
                        }
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
                        boxShadow:
                            "0px 0px 10px rgba(0,0,0,0.5)",
                        zIndex: 1000,
                    }}
                >
                    <h3>Profile</h3>

                    <p>Username: Harshith</p>

                    <p>
                        Anime Watching: {animeWatching}
                    </p>

                    <p>
                        Anime Completed: {animeCompleted}
                    </p>

                    <p>
                        Manga Reading: {mangaReading}
                    </p>

                    <p>
                        Manga Completed: {mangaCompleted}
                    </p>

                    <p>
                        Total Library: {library.length}
                    </p>

                    <button
                        onClick={handleLogout}
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