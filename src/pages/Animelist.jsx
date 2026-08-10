import React from 'react';
import {useState,useEffect} from 'react';
import './Anime.css';
import { getAnime } from '../services/api';

const Animelist = () => {
  const [current,setCurrent] = useState(0);
  useEffect(() => {
  const timer = setInterval(() => {
    setCurrent(prev => (prev + 1) % 5)
  }, 5000)

  return () => clearInterval(timer)
}, []);
  
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