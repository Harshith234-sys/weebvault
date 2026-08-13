import React, { useState, useEffect } from "react";
import "./Anime.css";
import { getAnime, getLibrary } from "../services/api";

const Animelist = () => {
    const [trending, setTrending] = useState([]);
    const [library, setLibrary] = useState([]);
    const [current, setCurrent] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAnime = async () => {
            try {
                const data = await getAnime();

                setTrending(data.data || []);
            } catch (error) {
                console.error("Anime fetch error:", error);
                setError("Failed to load anime");
            } finally {
                setLoading(false);
            }
        };

        fetchAnime();
    }, []);

    useEffect(() => {
        const fetchLibrary = async () => {
            try {
                const data = await getLibrary();

                setLibrary(data.library || []);
            } catch (error) {
                console.error("Library fetch error:", error);
            }
        };

        fetchLibrary();
    }, []);

    useEffect(() => {
        if (!trending.length) return;

        const timer = setInterval(() => {
            setCurrent(
                (prev) => (prev + 1) % trending.length
            );
        }, 5000);

        return () => clearInterval(timer);
    }, [trending]);

    // Loading

    if (loading) {
        return <div>Loading anime...</div>;
    }

    // Error

    if (error) {
        return <div>{error}</div>;
    }

    // Empty

    if (!trending.length) {
        return <div>No anime found</div>;
    }

    const anime = trending[current];

    // MAL data is inside anime.node

    const animeData = anime.node;

    // Bookmark

    const handleBookmark = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Please login first");
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:5000/api/library",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        mediaId: animeData.id,
                        type: "anime",
                        title: animeData.title,
                        status: "plan_to_watch",
                        currentEpisode: 0,
                        watchTimestamp: 0,
                        rating: null,
                        favorite: false
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(
                    data.message ||
                    "Failed to add anime"
                );
                return;
            }

            alert("Added to your library!");

            console.log(
                "Library entry:",
                data.libraryEntry
            );

        } catch (error) {
            console.error(
                "Bookmark error:",
                error
            );

            alert(
                "Failed to connect to server"
            );
        }
    };

const continueWatching = library.filter(
    (item) =>
        item.type === "anime" &&
        item.status === "watching"
);

    return (
        <div className="anime-container">

            {/* CAROUSEL */}

            <div className="anime-carousel">

                <img
                    src={
                        animeData.main_picture?.large ||
                        animeData.main_picture?.medium
                    }
                    alt={animeData.title}
                    className="anime-bg"
                />

                <div className="anime-overlay" />

                <div className="anime-text">

                    <span className="car-title">
                        {animeData.title}
                    </span>

                    <span className="car-ep">
                        {animeData.num_episodes || "N/A"} EP
                    </span>

                    <button className="watch-now">
                        Watch Now
                    </button>

                    <button
                        className="bookmark"
                        onClick={handleBookmark}
                    >
                        Bookmark
                    </button>

                </div>

                {/* Previous */}

                <button
                    className="prev-btn"
                    onClick={() =>
                        setCurrent(
                            (current - 1 + trending.length) %
                            trending.length
                        )
                    }
                >
                    ‹
                </button>

                {/* Next */}

                <button
                    className="next-btn"
                    onClick={() =>
                        setCurrent(
                            (current + 1) %
                            trending.length
                        )
                    }
                >
                    ›
                </button>

            </div>

            {/* TRENDING */}

            <div className="trending-anime">

                <h2>Trending</h2>

                <div className="trending-row">

                    {trending.map((item, index) => {

                        const anime = item.node;

                        return (
                            <div
                                className="trend-card"
                                key={anime.id}
                            >

                                <img
                                    src={
                                        anime.main_picture?.large ||
                                        anime.main_picture?.medium
                                    }
                                    alt={anime.title}
                                />

                                <span className="rank">
                                    {String(index + 1).padStart(2, "0")}
                                </span>

                                <p>
                                    {anime.title}
                                </p>

                            </div>
                        );

                    })}

                </div>

            </div>

{/* CONTINUE WATCHING */}

<div className="continue-watching">

    <h2>Continue Watching</h2>

    <div className="continue-list">

        {continueWatching.length === 0 ? (

            <p>
                No anime currently being watched.
            </p>

        ) : (

            continueWatching.map((item) => (

                <div
                    className="continue-card"
                    key={item._id}
                >

                    <img
                        src={item.image}
                        alt={item.title}
                    />

                    <div className="continue-info">

                        <p className="continue-title">
                            {item.title}
                        </p>

                        <p className="continue-eps">
                            Episode {item.currentEpisode || 0}
                        </p>

                        <button className="resume-btn">
                            ▶ Resume
                        </button>

                    </div>

                </div>

            ))

        )}

    </div>

</div>
        </div>
    );
};

export default Animelist;