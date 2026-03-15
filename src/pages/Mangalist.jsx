import React from 'react';
import { useState ,useEffect} from 'react';
import './Manga.css';

const Mangalist = () => {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
  const timer = setInterval(() => {
    setCurrent(prev => (prev + 1) % manga.length)
  }, 5000)

  return () => clearInterval(timer)
}, [])

const manga = [
  { id: 1,  title: "Jujutsu Kaisen",                cover: "https://cdn.myanimelist.net/images/manga/3/210341l.jpg",  chapters: 265,  status: "Releasing", genres: ["Action", "Supernatural"] },
  { id: 2,  title: "One Piece",                      cover: "https://cdn.myanimelist.net/images/manga/2/253146l.jpg",  chapters: 1110, status: "Releasing", genres: ["Adventure", "Fantasy"] },
  { id: 3,  title: "Demon Slayer",                   cover: "https://cdn.myanimelist.net/images/manga/3/179023l.jpg",  chapters: 205,  status: "Completed", genres: ["Action", "Dark Fantasy"] },
  { id: 4,  title: "Dragon Ball Super",              cover: "https://cdn.myanimelist.net/images/manga/1/267793l.jpg",  chapters: 104,  status: "Releasing", genres: ["Action", "Sci-Fi"] },
  { id: 5,  title: "Chainsaw Man",                   cover: "https://cdn.myanimelist.net/images/manga/3/216464l.jpg",  chapters: 97,   status: "Releasing", genres: ["Action", "Horror"] },
  { id: 6,  title: "Vagabond",                       cover: "https://cdn.myanimelist.net/images/manga/1/259070l.jpg",  chapters: 327,  status: "Hiatus",    genres: ["Action", "Historical"] },
  { id: 7,  title: "Solo Leveling",                  cover: "https://cdn.myanimelist.net/images/manga/3/222295l.jpg",  chapters: 179,  status: "Completed", genres: ["Action", "Fantasy"],     type: "Manhwa" },
  { id: 8,  title: "Tower of God",                   cover: "https://cdn.myanimelist.net/images/manga/2/175936l.jpg",  chapters: 600,  status: "Releasing", genres: ["Fantasy", "Adventure"],  type: "Manhwa" },
  { id: 9,  title: "Omniscient Reader",              cover: "https://cdn.myanimelist.net/images/manga/1/274289l.jpg",  chapters: 180,  status: "Releasing", genres: ["Action", "Fantasy"],     type: "Manhwa" },
  { id: 10, title: "Eleceed",                        cover: "https://cdn.myanimelist.net/images/manga/2/207291l.jpg",  chapters: 290,  status: "Releasing", genres: ["Action", "Comedy"],      type: "Manhwa" },
  { id: 11, title: "Nano Machine",                   cover: "https://cdn.myanimelist.net/images/manga/1/267700l.jpg",  chapters: 220,  status: "Releasing", genres: ["Action", "Martial Arts"], type: "Manhwa" },
  { id: 12, title: "Lookism",                        cover: "https://cdn.myanimelist.net/images/manga/2/194697l.jpg",  chapters: 470,  status: "Releasing", genres: ["Action", "Slice of Life"], type: "Manhwa" },
];

  const current_manga = manga[current];

  return (
    <div className="manga-container">
      <div className="manga-carousel">
      <button className="manga-prev" onClick={() => setCurrent((current - 1 + manga.length) % manga.length)}>‹</button>

        <div className="manga-cards">
  {[0, 1, 2].map(offset => {
    const index = (current + offset) % manga.length;
    const m = manga[index];
    return (
      <div className="manga-card" key={m.id}>
        <div className="manga-card-text">
          <span className="manga-status">{m.status}</span>
          <h3 className="manga-card-title">{m.title}</h3>
          <p className="manga-card-desc">Chapter {m.chapters}</p>
          <div className="manga-genres">
            {m.genres.map(g => (
              <span key={g} className="manga-genre">{g}</span>
            ))}
          </div>
        </div>
        <img src={m.cover} alt={m.title} className="manga-card-img" />
      </div>
    );
  })}
</div>

        <button className="manga-next" onClick={() => setCurrent((current + 1) % manga.length)}>›</button>
      </div>
      <div className="most-viewed">
        <h2>Most Viewed</h2>
        <div className="most-viewed-row">
          {manga.map((m, index) => (
            <div className="most-viewed-card" key={m.id}>
              <img src={m.cover} alt={m.title} />
              <span className="most-viewed-rank">{index + 1}</span>
              <p>{m.title}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="continue-reading">
        <h2>Continue Reading</h2>
        <div className="reading-list">
          <div className="reading-card">
            <img src={current_manga.cover} alt={current_manga.title} />
            <div className="reading-info">
              <span className="reading-type">Manga</span>
              <p className="reading-title">{current_manga.title}</p>
              <p className="reading-progress">Chapter 1 / {current_manga.chapters}</p>
              <button className="resume-btn">▶ Continue Reading</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Mangalist;