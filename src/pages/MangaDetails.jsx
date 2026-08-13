import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { addToLibrary, getMangaDetails } from "../services/api";
import "./Details.css";

function MangaDetails() {
    const { id } = useParams();
    const [manga, setManga] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const loadManga = async () => {
            try {
                setManga(await getMangaDetails(id));
            } catch (loadError) {
                console.error("Manga details error:", loadError);
                setError("Failed to load manga details");
            } finally {
                setLoading(false);
            }
        };
        loadManga();
    }, [id]);

    const addManga = async () => {
        try {
            await addToLibrary({
                mediaId: manga.id,
                type: "manga",
                title: manga.title,
                status: "plan_to_read",
                currentChapter: 0,
                currentPage: 0,
                rating: null,
                favorite: false
            });
            setMessage("Added to your library.");
        } catch (addError) {
            console.error("Add manga error:", addError);
            setMessage(addError.message || "Failed to add manga to your library.");
        }
    };

    if (loading) return <main className="details-page"><p>Loading manga details...</p></main>;
    if (error || !manga) return <main className="details-page"><p className="details-message">{error || "Manga not found"}</p></main>;

    const alternativeTitles = [
        manga.alternative_titles?.en,
        ...(manga.alternative_titles?.synonyms || [])
    ].filter((title, index, titles) => title && title !== manga.title && titles.indexOf(title) === index);
    const authors = (manga.authors || []).map((author) =>
        [author.first_name, author.last_name].filter(Boolean).join(" ")
    ).filter(Boolean);
    const facts = [
        ["Score", manga.mean],
        ["Rank", manga.rank ? `#${manga.rank}` : null],
        ["Popularity", manga.popularity ? `#${manga.popularity}` : null],
        ["Status", manga.status],
        ["Chapters", manga.num_chapters],
        ["Volumes", manga.num_volumes],
        ["Authors", authors.join(", ")]
    ];

    return (
        <main className="details-page">
            <Link className="details-back" to="/Mangalist">← Back to Manga</Link>
            <section className="details-hero">
                <div className="details-poster">
                    {manga.main_picture?.large || manga.main_picture?.medium ? (
                        <img src={manga.main_picture.large || manga.main_picture.medium} alt={manga.title} />
                    ) : <span>Cover unavailable</span>}
                </div>
                <div className="details-content">
                    <p className="details-type">Manga</p>
                    <h1>{manga.title}</h1>
                    {alternativeTitles.length > 0 && <p className="details-alternative">Also known as {alternativeTitles.join(" · ")}</p>}
                    {manga.synopsis && <p className="details-synopsis">{manga.synopsis}</p>}
                    <div className="details-actions">
                        <button className="details-primary" type="button" onClick={addManga}>Add to Library</button>
                    </div>
                    {message && <p className="details-message" role="status">{message}</p>}
                </div>
            </section>

            <section className="details-section">
                <h2>Details</h2>
                <dl className="details-facts">
                    {facts.filter(([, value]) => value !== null && value !== undefined && value !== "").map(([label, value]) => (
                        <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
                    ))}
                </dl>
                {manga.genres?.length > 0 && (
                    <div className="details-genres">
                        <h2>Genres</h2>
                        <div>{manga.genres.map((genre) => <span key={genre.id}>{genre.name}</span>)}</div>
                    </div>
                )}
            </section>
        </main>
    );
}

export default MangaDetails;
