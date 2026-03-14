// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Choice from "./pages/Choice";
import Animelist from "./pages/Animelist";
import Mangalist from "./pages/Mangalist";
import Navbar from "./components/Navbar";
import './index.css';

function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/choice" element={<Choice />} />
        <Route path="/Animelist" element = {<Animelist/>} />
        <Route path="/Mangalist" element = {<Mangalist/>} />
      </Routes>
    </Router>
  );
}

export default App;