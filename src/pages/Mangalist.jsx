import React, { useEffect, useState } from "react";
import "./Manga.css";
import { getLibrary, getManga, getMangaDetails } from "../services/api";

const Mangalist = () => {
    const [manga, setManga] = useState([]);
    const [continueReading, setContinueReading] = useState([]);
    const [libraryMedia, setLibraryMedia] = useState({});
    const [current, setCurrent] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchManga = async () => {
            try {
                const data = await getManga();
                setManga(data.data || []);
            } catch (fetchError) {
                console.error("Manga fetch error:", fetchError);
                setError("Failed to load manga");
            } finally {
                setLoading(false);
            }
        };
        fetchManga();
    }, []);

    useEffect(() => {
        const fetchContinueReading = async () => {
            try {
                const data = await getLibrary();
                const reading = (data.library || []).filter(
                    (item) => item.type === "manga" && item.status === "reading"
                );
                setContinueReading(reading);
                const details = await Promise.all(reading.map(async (item) => {
                    try {
                        return [item._id, await getMangaDetails(item.mediaId)];
                    } catch (mediaError) {
                        console.error("Continue Reading media error:", mediaError);
                        return [item._id, null];
                    }
                }));
                setLibraryMedia(Object.fromEntries(details));
            } catch (libraryError) {
                console.error("Continue Reading library error:", libraryError);
            }
        };
        fetchContinueReading();
    }, []);

    useEffect(() => {
        if (!manga.length) return undefined;
        const timer = setInterval(() => setCurrent((previous) => (previous + 1) % manga.length), 5000);
        return () => clearInterval(timer);
    }, [manga]);

    if (loading) return <div>Loading manga...</div>;
    if (error) return <div>{error}</div>;
    if (!manga.length) return <div>No manga found</div>;

    return (
        <div className="manga-container">
            <div className="manga-carousel">
                <button className="manga-prev" type="button" onClick={() => setCurrent((current - 1 + manga.length) % manga.length)}>‹</button>
                <div className="manga-cards">
                    {[0, 1, 2].map((offset) => {
                        const item = manga[(current + offset) % manga.length].node;
                        return (
                            <div className="manga-card" key={item.id}>
                                <div className="manga-card-text">
                                    <span className="manga-status">{item.status || "Unknown"}</span>
                                    <h3 className="manga-card-title">{item.title}</h3>
                                    <p className="manga-card-desc">Chapter {item.num_chapters || "N/A"}</p>
                                    <div className="manga-genres">{(item.genres || []).slice(0, 3).map((genre) => <span key={genre.id} className="manga-genre">{genre.name}</span>)}</div>
                                </div>
                                <img src={item.main_picture?.large || item.main_picture?.medium} alt={item.title} className="manga-card-img" />
                            </div>
                        );
                    })}
                </div>
                <button className="manga-next" type="button" onClick={() => setCurrent((current + 1) % manga.length)}>›</button>
            </div>

            <div className="most-viewed">
                <h2>Most Viewed</h2>
                <div className="most-viewed-row">
                    {manga.map((entry, index) => {
                        const item = entry.node;
                        return (
                            <div className="most-viewed-card" key={item.id}>
                                <img src={item.main_picture?.large || item.main_picture?.medium} alt={item.title} />
                                <span className="most-viewed-rank">{index + 1}</span>
                                <p>{item.title}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="continue-reading">
                <h2>Continue Reading</h2>
                <div className="reading-list">
                    {continueReading.length === 0 ? <p className="reading-empty">No manga currently being read.</p> : continueReading.map((entry) => {
                        const item = libraryMedia[entry._id];
                        const cover = item?.main_picture?.large || item?.main_picture?.medium;
                        return (
                            <div className="reading-card" key={entry._id}>
                                {cover ? <img src={cover} alt={entry.title} /> : <div className="reading-cover-unavailable">Cover unavailable</div>}
                                <div className="reading-info">
                                    <span className="reading-type">Manga</span>
                                    <p className="reading-title">{entry.title}</p>
                                    <p className="reading-progress">Chapter {entry.currentChapter || 0}{item?.num_chapters ? ` / ${item.num_chapters}` : ""}</p>
                                    <button className="resume-btn" type="button">▶ Continue Reading</button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Mangalist;
