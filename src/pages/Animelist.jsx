import React from 'react';
import {useState} from 'react';
import './Anime.css';

const Animelist = () => {
  const [current,setCurrent] = useState(0)
  const trending = [
 { id: 1, title: "Naruto", cover: "https://cdn.myanimelist.net/images/anime/13/17405l.jpg", episodes: 220 },
{ id: 2, title: "One Piece", cover: "https://cdn.myanimelist.net/images/anime/6/73245l.jpg", episodes: 1100 },
{ id: 3, title: "Jujutsu Kaisen", cover: "https://cdn.myanimelist.net/images/anime/1171/109222l.jpg", episodes: 24 },
{ id: 4, title: "Demon Slayer", cover: "https://cdn.myanimelist.net/images/anime/1286/99889l.jpg", episodes: 26 },
{ id: 5, title: "Attack on Titan", cover: "https://cdn.myanimelist.net/images/anime/10/47347l.jpg", episodes: 75 },
];
const anime = trending[current];
  return (
      <div className="anime-container">
        <div className="anime-carousel">
            <div className="anime-carousel">

              <img src={anime.cover} alt={anime.title} className="anime-bg" />

              <div className="anime-overlay" />
              <div className="anime-text">
                <span className="car-title">{anime.title}</span>
                <span className="car-ep">{anime.episodes} EP</span>
                <button className="watch-now">Watch Now</button>
                <button className="bookmark">Bookmark</button>
              </div>

              <button className="prev-btn" onClick={() => setCurrent((current - 1 + 5) % 5)}>›</button>
              <button className="next-btn" onClick={() => setCurrent((current + 1) % 5)}>‹</button>

            </div>
        </div>
        <div className="trending-anime">
          <div className="trending-anime">
  <h2>Trending</h2>

  <div className="trending-row">
    {trending.map((anime, index) => (
      <div className="trend-card" key={anime.id}>
        <img src={anime.cover} alt={anime.title} />
        <span className="rank">{String(index + 1).padStart(2, '0')}</span>
        <p>{anime.title}</p>
      </div>
    ))}
  </div>

</div>
        </div>
<div className="continue-watching">
  <h2>Continue Watching</h2>

  <div className="continue-list">
    <div className="continue-card">
      <img src={anime.cover} alt={anime.title} />
      <div className="continue-info">
  <p className="continue-title">{anime.title}</p>
  <p className="continue-eps">Episode 1 / {anime.episodes}</p>
  <button className="resume-btn">▶ Resume</button>
</div>
    </div>
  </div>

</div>
    </div>
  )
}

export default Animelist