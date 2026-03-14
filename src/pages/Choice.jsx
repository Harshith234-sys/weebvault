import React from 'react'
import { useNavigate } from "react-router-dom";
import bg from "../images/bg.jpg";
const Choice = () => {
  const navigate = useNavigate();
  const handleAnime = () => {
    navigate("/AnimeList");
  }
  const handleManga = () => {
    navigate("/Mangalist");
  }
  return (
    <>
<div
  className="bg-container d-flex justify-content-center align-items-center vh-100"
  style={{ backgroundImage: `url(${bg})` }}
>
  <div className="overlay"></div>

  <div className="choice-box p-5 rounded text-center">
    <div className="btn-container">
      <button className="choice-btn" onClick={handleAnime}>Anime</button>
      <button className="choice-btn" onClick={handleManga}>Manga</button>
    </div>
  </div>
</div>
    </>
  )
}

export default Choice