import React, { useState, useEffect } from "react";
import "./Manga.css";
import { getManga } from "../services/api";

const Mangalist = () => {
    const [manga, setManga] = useState([]);
    const [current, setCurrent] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchManga = async () => {
            try {
                const data = await getManga();

                setManga(data.data || []);
            } catch (error) {
                console.error("Manga fetch error:", error);
                setError("Failed to load manga");
            } finally {
                setLoading(false);
            }
        };

        fetchManga();
    }, []);

    useEffect(() => {
        if (!manga.length) return;

        const timer = setInterval(() => {
            setCurrent(
                (prev) => (prev + 1) % manga.length
            );
        }, 5000);

        return () => clearInterval(timer);
    }, [manga]);

    if (loading) {
        return <div>Loading manga...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!manga.length) {
        return <div>No manga found</div>;
    }

    const currentManga = manga[current].node;

    return (
        <div className="manga-container">

            <div className="manga-carousel">

                <button
                    className="manga-prev"
                    onClick={() =>
                        setCurrent(
                            (current - 1 + manga.length) %
                            manga.length
                        )
                    }
                >
                    ‹
                </button>

                <div className="manga-cards">

                    {[0, 1, 2].map((offset) => {

                        const index =
                            (current + offset) % manga.length;

                        const item = manga[index];
                        const m = item.node;

                        return (
                            <div
                                className="manga-card"
                                key={m.id}
                            >

                                <div className="manga-card-text">

                                    <span className="manga-status">
                                        {m.status || "Unknown"}
                                    </span>

                                    <h3 className="manga-card-title">
                                        {m.title}
                                    </h3>

                                    <p className="manga-card-desc">
                                        Chapter{" "}
                                        {m.num_chapters || "N/A"}
                                    </p>

                                    <div className="manga-genres">
                                        {(m.genres || []).slice(0, 3).map(
                                            (genre) => (
                                                <span
                                                    key={genre.id}
                                                    className="manga-genre"
                                                >
                                                    {genre.name}
                                                </span>
                                            )
                                        )}
                                    </div>

                                </div>

                                <img
                                    src={
                                        m.main_picture?.large ||
                                        m.main_picture?.medium
                                    }
                                    alt={m.title}
                                    className="manga-card-img"
                                />

                            </div>
                        );
                    })}

                </div>

                <button
                    className="manga-next"
                    onClick={() =>
                        setCurrent(
                            (current + 1) % manga.length
                        )
                    }
                >
                    ›
                </button>

            </div>

            <div className="most-viewed">

                <h2>Most Viewed</h2>

                <div className="most-viewed-row">

                    {manga.map((item, index) => {

                        const m = item.node;

                        return (
                            <div
                                className="most-viewed-card"
                                key={m.id}
                            >

                                <img
                                    src={
                                        m.main_picture?.large ||
                                        m.main_picture?.medium
                                    }
                                    alt={m.title}
                                />

                                <span className="most-viewed-rank">
                                    {index + 1}
                                </span>

                                <p>
                                    {m.title}
                                </p>

                            </div>
                        );
                    })}

                </div>

            </div>

            <div className="continue-reading">

                <h2>Continue Reading</h2>

                <div className="reading-list">

                    <div className="reading-card">

                        <img
                            src={
                                currentManga.main_picture?.large ||
                                currentManga.main_picture?.medium
                            }
                            alt={currentManga.title}
                        />

                        <div className="reading-info">

                            <span className="reading-type">
                                Manga
                            </span>

                            <p className="reading-title">
                                {currentManga.title}
                            </p>

                            <p className="reading-progress">
                                Chapter 1 /{" "}
                                {currentManga.num_chapters || "N/A"}
                            </p>

                            <button className="resume-btn">
                                ▶ Continue Reading
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Mangalist;