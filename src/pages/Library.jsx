import { useEffect, useMemo, useState } from "react";
import {
    deleteLibraryEntry,
    getAnimeDetails,
    getLibrary,
    getMangaDetails,
    updateLibraryEntry
} from "../services/api";
import "./Library.css";

const animeStatuses = ["watching", "completed", "plan_to_watch", "on_hold", "dropped"];
const mangaStatuses = ["reading", "completed", "plan_to_read", "on_hold", "dropped"];

const statusLabel = (status) => status.replaceAll("_", " ");

function Library() {
    const [entries, setEntries] = useState([]);
    const [media, setMedia] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [savingId, setSavingId] = useState("");

    useEffect(() => {
        const loadLibrary = async () => {
            try {
                const data = await getLibrary();
                const library = data.library || [];
                setEntries(library);

                const details = await Promise.all(
                    library.map(async (entry) => {
                        try {
                            const item = entry.type === "anime"
                                ? await getAnimeDetails(entry.mediaId)
                                : await getMangaDetails(entry.mediaId);
                            return [entry._id, item];
                        } catch (mediaError) {
                            console.error("Library media fetch error:", mediaError);
                            return [entry._id, null];
                        }
                    })
                );

                setMedia(Object.fromEntries(details));
            } catch (loadError) {
                console.error("Library fetch error:", loadError);
                setError(loadError.message || "Failed to load your library");
            } finally {
                setLoading(false);
            }
        };

        loadLibrary();
    }, []);

    const groupedEntries = useMemo(() => ({
        anime: entries.filter((entry) => entry.type === "anime"),
        manga: entries.filter((entry) => entry.type === "manga")
    }), [entries]);

    const updateEntry = async (entry, changes) => {
        setSavingId(entry._id);
        setMessage("");

        try {
            const data = await updateLibraryEntry(entry._id, changes);
            setEntries((current) => current.map((item) =>
                item._id === entry._id ? data.libraryEntry : item
            ));
        } catch (updateError) {
            console.error("Library update error:", updateError);
            setMessage(updateError.message || "Could not update this entry");
        } finally {
            setSavingId("");
        }
    };

    const removeEntry = async (entry) => {
        if (!window.confirm(`Remove ${entry.title} from your library?`)) return;

        setSavingId(entry._id);
        setMessage("");

        try {
            await deleteLibraryEntry(entry._id);
            setEntries((current) => current.filter((item) => item._id !== entry._id));
            setMedia((current) => {
                const next = { ...current };
                delete next[entry._id];
                return next;
            });
        } catch (deleteError) {
            console.error("Library delete error:", deleteError);
            setMessage(deleteError.message || "Could not remove this entry");
        } finally {
            setSavingId("");
        }
    };

    if (loading) return <main className="library-page"><p>Loading your library...</p></main>;
    if (error) return <main className="library-page"><p className="library-message">{error}</p></main>;

    return (
        <main className="library-page">
            <header className="library-header">
                <div>
                    <p className="library-eyebrow">Personal collection</p>
                    <h1>My Library</h1>
                </div>
                <p>{entries.length} saved {entries.length === 1 ? "title" : "titles"}</p>
            </header>

            {message && <p className="library-message" role="alert">{message}</p>}

            <LibrarySection
                title="Anime"
                entries={groupedEntries.anime}
                media={media}
                statuses={animeStatuses}
                savingId={savingId}
                onUpdate={updateEntry}
                onRemove={removeEntry}
            />
            <LibrarySection
                title="Manga"
                entries={groupedEntries.manga}
                media={media}
                statuses={mangaStatuses}
                savingId={savingId}
                onUpdate={updateEntry}
                onRemove={removeEntry}
            />
        </main>
    );
}

function LibrarySection({ title, entries, media, statuses, savingId, onUpdate, onRemove }) {
    return (
        <section className="library-section">
            <h2>{title}</h2>
            {entries.length === 0 ? (
                <p className="library-empty">No {title.toLowerCase()} saved yet.</p>
            ) : (
                <div className="library-status-groups">
                    {statuses.map((status) => {
                        const items = entries.filter((entry) => entry.status === status);
                        if (!items.length) return null;

                        return (
                            <div className="library-status-group" key={status}>
                                <h3>{statusLabel(status)}</h3>
                                <div className="library-grid">
                                    {items.map((entry) => (
                                        <LibraryCard
                                            entry={entry}
                                            item={media[entry._id]}
                                            statuses={statuses}
                                            saving={savingId === entry._id}
                                            onUpdate={onUpdate}
                                            onRemove={onRemove}
                                            key={`${entry._id}-${entry.currentEpisode}-${entry.currentChapter}-${entry.currentPage}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}

function LibraryCard({ entry, item, statuses, saving, onUpdate, onRemove }) {
    const isAnime = entry.type === "anime";
    const picture = item?.main_picture?.large || item?.main_picture?.medium;
    const total = isAnime ? item?.num_episodes : item?.num_chapters;
    const current = isAnime ? entry.currentEpisode : entry.currentChapter;
    const [episodeValue, setEpisodeValue] = useState(String(entry.currentEpisode ?? 0));
    const [chapterValue, setChapterValue] = useState(String(entry.currentChapter ?? 0));
    const [pageValue, setPageValue] = useState(String(entry.currentPage ?? 0));
    const [progressError, setProgressError] = useState("");

    const saveProgress = (field, value, label) => {
        const progress = Number(value);

        if (!Number.isInteger(progress) || progress < 0) {
            setProgressError(`${label} must be a whole number of zero or more.`);
            return;
        }

        if (total > 0 && field !== "currentPage" && progress > total) {
            setProgressError(`${label} cannot be higher than ${total}.`);
            return;
        }

        setProgressError("");
        if (progress !== (entry[field] ?? 0)) {
            onUpdate(entry, { [field]: progress });
        }
    };

    const saveOnEnter = (event) => {
        if (event.key === "Enter") event.currentTarget.blur();
    };

    return (
        <article className="library-card">
            <div className="library-cover">
                {picture ? <img src={picture} alt={entry.title} /> : <span>Cover unavailable</span>}
            </div>
            <div className="library-card-content">
                <p className="library-type">{entry.type}</p>
                <h4>{entry.title}</h4>
                <p className="library-progress">
                    {isAnime ? "Episode" : "Chapter"} {current || 0}{total ? ` / ${total}` : ""}
                    {!isAnime && entry.currentPage ? ` · Page ${entry.currentPage}` : ""}
                </p>

                <label>
                    Status
                    <select
                        value={entry.status}
                        disabled={saving}
                        onChange={(event) => onUpdate(entry, { status: event.target.value })}
                    >
                        {statuses.map((status) => <option value={status} key={status}>{statusLabel(status)}</option>)}
                    </select>
                </label>

                <div className="library-controls">
                    <label>
                        {isAnime ? "Episode" : "Chapter"}
                        <input
                            type="number"
                            min="0"
                            max={total > 0 ? total : undefined}
                            value={isAnime ? episodeValue : chapterValue}
                            disabled={saving}
                            onChange={(event) => (isAnime ? setEpisodeValue(event.target.value) : setChapterValue(event.target.value))}
                            onBlur={(event) => saveProgress(isAnime ? "currentEpisode" : "currentChapter", event.target.value, isAnime ? "Episode" : "Chapter")}
                            onKeyDown={saveOnEnter}
                        />
                    </label>
                    {!isAnime && (
                        <label>
                            Page
                            <input
                                type="number"
                                min="0"
                                value={pageValue}
                                disabled={saving}
                                onChange={(event) => setPageValue(event.target.value)}
                                onBlur={(event) => saveProgress("currentPage", event.target.value, "Page")}
                                onKeyDown={saveOnEnter}
                            />
                        </label>
                    )}
                    <label>
                        Rating
                        <input
                            type="number"
                            min="0"
                            max="10"
                            step="0.5"
                            value={entry.rating ?? ""}
                            placeholder="–"
                            disabled={saving}
                            onChange={(event) => onUpdate(entry, {
                                rating: event.target.value === "" ? null : Number(event.target.value)
                            })}
                        />
                    </label>
                </div>

                <div className="library-actions">
                    <button
                        className={entry.favorite ? "favorite active" : "favorite"}
                        disabled={saving}
                        onClick={() => onUpdate(entry, { favorite: !entry.favorite })}
                    >
                        {entry.favorite ? "★ Favorite" : "☆ Favorite"}
                    </button>
                    <button className="remove" disabled={saving} onClick={() => onRemove(entry)}>Remove</button>
                </div>
                {progressError && <p className="library-progress-error" role="alert">{progressError}</p>}
            </div>
        </article>
    );
}

export default Library;
