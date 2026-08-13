import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { addToLibrary, getAnimeDetails } from "../services/api";
import "./Details.css";

const formatDuration = (seconds) => {
    if (!seconds) return null;
    const minutes = Math.round(seconds / 60);
    return `${minutes} min`;
};

function AnimeDetails() {
    const { id } = useParams();
    const [anime, setAnime] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const loadAnime = async () => {
            try {
                setAnime(await getAnimeDetails(id));
            } catch (loadError) {
                console.error("Anime details error:", loadError);
                setError("Failed to load anime details");
            } finally {
                setLoading(false);
            }
        };
        loadAnime();
    }, [id]);

    const addAnime = async () => {
        try {
            await addToLibrary({
                mediaId: anime.id,
                type: "anime",
                title: anime.title,
                status: "plan_to_watch",
                currentEpisode: 0,
                watchTimestamp: 0,
                rating: null,
                favorite: false
            });
            setMessage("Added to your library.");
        } catch (addError) {
            console.error("Add anime error:", addError);
            setMessage(addError.message || "Failed to add anime to your library.");
        }
    };

    if (loading) return <main className="details-page"><p>Loading anime details...</p></main>;
    if (error || !anime) return <main className="details-page"><p className="details-message">{error || "Anime not found"}</p></main>;

    const alternativeTitle = anime.alternative_titles?.en || anime.alternative_titles?.synonyms?.[0];
    const season = anime.start_season && `${anime.start_season.season} ${anime.start_season.year}`;
    const facts = [
        ["Score", anime.mean],
        ["Rank", anime.rank ? `#${anime.rank}` : null],
        ["Popularity", anime.popularity ? `#${anime.popularity}` : null],
        ["Status", anime.status],
        ["Episodes", anime.num_episodes],
        ["Duration", formatDuration(anime.average_episode_duration)],
        ["Season", season]
    ];

    return (
        <main className="details-page">
            <Link className="details-back" to="/Animelist">← Back to Anime</Link>
            <section className="details-hero">
                <div className="details-poster">
                    {anime.main_picture?.large || anime.main_picture?.medium ? (
                        <img src={anime.main_picture.large || anime.main_picture.medium} alt={anime.title} />
                    ) : <span>Cover unavailable</span>}
                </div>
                <div className="details-content">
                    <p className="details-type">Anime</p>
                    <h1>{anime.title}</h1>
                    {alternativeTitle && alternativeTitle !== anime.title && <p className="details-alternative">Also known as {alternativeTitle}</p>}
                    {anime.synopsis && <p className="details-synopsis">{anime.synopsis}</p>}
                    <div className="details-actions">
                        <button className="details-primary" type="button" onClick={addAnime}>Add to Library</button>
                        <button className="details-secondary" type="button" onClick={() => setMessage("Playback will be connected in the future streaming architecture.")}>Watch</button>
                    </div>
                    {message && <p className="details-message" role="status">{message}</p>}
                </div>
            </section>

            <section className="details-section">
                <h2>Details</h2>
                <dl className="details-facts">
                    {facts.filter(([, value]) => value !== null && value !== undefined).map(([label, value]) => (
                        <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
                    ))}
                </dl>
                {anime.genres?.length > 0 && (
                    <div className="details-genres">
                        <h2>Genres</h2>
                        <div>{anime.genres.map((genre) => <span key={genre.id}>{genre.name}</span>)}</div>
                    </div>
                )}
            </section>
        </main>
    );
}

export default AnimeDetails;
