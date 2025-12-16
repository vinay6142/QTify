import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Section from './components/Section/Section';

function App() {
  const [searchData, setSearchData] = useState([]);

  useEffect(() => {
    // Placeholder for API call to fetch search data
    // This would typically fetch albums/songs from a backend
    setSearchData([
      { id: 1, title: 'Album 1', slug: 'album-1', songs: [{ artists: ['Artist 1'] }] },
      { id: 2, title: 'Album 2', slug: 'album-2', songs: [{ artists: ['Artist 2'] }] },
      { id: 3, title: 'Album 3', slug: 'album-3', songs: [{ artists: ['Artist 3'] }] },
    ]);
  }, []);

  return (
    <Router>
      <div className="App">
        <Navbar searchData={searchData} />
        <Routes>
          <Route 
            path="/" 
            element={
              <>
                <Hero />
                <Section 
                  title="Top Albums" 
                  apiEndpoint="https://qtify-backend.labs.crio.do/albums/top"
                />
                <Section 
                  title="New Albums" 
                  apiEndpoint="https://qtify-backend.labs.crio.do/albums/new"
                />
                <Section 
                  title="Songs" 
                  apiEndpoint="https://qtify-backend.labs.crio.do/songs"
                  showLikes={true}
                  isSongsSection={true}
                />
              </>
            } 
          />
          <Route path="/album/:slug" element={<div>Album Page - Coming Soon</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
