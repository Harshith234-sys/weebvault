import React, { useEffect, useState } from "react";
import "./Anime.css";
import { addToLibrary, getAnime, getAnimeDetails, getLibrary } from "../services/api";

const Animelist = () => {
    const [trending, setTrending] = useState([]);
    const [continueWatching, setContinueWatching] = useState([]);
    const [libraryMedia, setLibraryMedia] = useState({});
    const [current, setCurrent] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAnime = async () => {
            try {
                const data = await getAnime();
                setTrending(data.data || []);
            } catch (fetchError) {
                console.error("Anime fetch error:", fetchError);
                setError("Failed to load anime");
            } finally {
                setLoading(false);
            }
        };

        fetchAnime();
    }, []);

    useEffect(() => {
        const fetchContinueWatching = async () => {
            try {
                const data = await getLibrary();
                const watching = (data.library || []).filter(
                    (item) => item.type === "anime" && item.status === "watching"
                );
                setContinueWatching(watching);

                const details = await Promise.all(watching.map(async (item) => {
                    try {
                        return [item._id, await getAnimeDetails(item.mediaId)];
                    } catch (mediaError) {
                        console.error("Continue Watching media error:", mediaError);
                        return [item._id, null];
                    }
                }));
                setLibraryMedia(Object.fromEntries(details));
            } catch (libraryError) {
                console.error("Continue Watching library error:", libraryError);
            }
        };

        fetchContinueWatching();
    }, []);

    useEffect(() => {
        if (!trending.length) return undefined;

        const timer = setInterval(() => {
            setCurrent((previous) => (previous + 1) % trending.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [trending]);

    if (loading) return <div>Loading anime...</div>;
    if (error) return <div>{error}</div>;
    if (!trending.length) return <div>No anime found</div>;

    const animeData = trending[current].node;

    const handleBookmark = async () => {
        try {
            await addToLibrary({
                mediaId: animeData.id,
                type: "anime",
                title: animeData.title,
                status: "plan_to_watch",
                currentEpisode: 0,
                watchTimestamp: 0,
                rating: null,
                favorite: false
            });
            window.alert("Added to your library!");
        } catch (bookmarkError) {
            console.error("Bookmark error:", bookmarkError);
            window.alert(bookmarkError.message || "Failed to add anime");
        }
    };

    return (
        <div className="anime-container">
            <div className="anime-carousel">
                <img
                    src={animeData.main_picture?.large || animeData.main_picture?.medium}
                    alt={animeData.title}
                    className="anime-bg"
                />
                <div className="anime-overlay" />
                <div className="anime-text">
                    <span className="car-title">{animeData.title}</span>
                    <span className="car-ep">{animeData.num_episodes || "N/A"} EP</span>
                    <button className="watch-now" type="button">Watch Now</button>
                    <button className="bookmark" type="button" onClick={handleBookmark}>Bookmark</button>
                </div>
                <button className="prev-btn" type="button" onClick={() => setCurrent((current - 1 + trending.length) % trending.length)}>‹</button>
                <button className="next-btn" type="button" onClick={() => setCurrent((current + 1) % trending.length)}>›</button>
            </div>

            <div className="trending-anime">
                <h2>Trending</h2>
                <div className="trending-row">
                    {trending.map((item, index) => {
                        const anime = item.node;
                        return (
                            <div className="trend-card" key={anime.id}>
                                <img src={anime.main_picture?.large || anime.main_picture?.medium} alt={anime.title} />
                                <span className="rank">{String(index + 1).padStart(2, "0")}</span>
                                <p>{anime.title}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="continue-watching">
                <h2>Continue Watching</h2>
                <div className="continue-list">
                    {continueWatching.length === 0 ? <p>No anime currently being watched.</p> : continueWatching.map((item) => {
                        const media = libraryMedia[item._id];
                        const cover = media?.main_picture?.large || media?.main_picture?.medium;
                        return (
                            <div className="continue-card" key={item._id}>
                                {cover ? <img src={cover} alt={item.title} /> : <div className="continue-cover-unavailable">Cover unavailable</div>}
                                <div className="continue-info">
                                    <p className="continue-title">{item.title}</p>
                                    <p className="continue-eps">Episode {item.currentEpisode || 0}{media?.num_episodes ? ` / ${media.num_episodes}` : ""}</p>
                                    <button className="resume-btn" type="button">▶ Resume</button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Animelist;
