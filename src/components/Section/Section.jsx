import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Tabs, Tab } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Card from "../Card/Card";
import styles from "./Section.module.css";

function Section({ title, apiEndpoint, showAll = false, onShowAllClick, showLikes = false, isSongsSection = false }) {
  const [items, setItems] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [collapsed, setCollapsed] = useState(true);
  const [cardsToShow, setCardsToShow] = useState(6);
  const [selectedTab, setSelectedTab] = useState(0);
  const swiperRef = useRef(null);

  // Calculate how many cards fit in the window
  useEffect(() => {
    const calculateCardsToShow = () => {
      const cardWidth = 159; // Card width in pixels
      const gap = 20; // Gap between cards
      const padding = 64; // Total padding (32px on each side)
      const availableWidth = window.innerWidth - padding;
      
      // Calculate how many full cards can fit
      const numCards = Math.floor((availableWidth + gap) / (cardWidth + gap));
      setCardsToShow(Math.max(numCards, 1)); // At least 1 card
    };

    calculateCardsToShow();
    window.addEventListener("resize", calculateCardsToShow);
    return () => window.removeEventListener("resize", calculateCardsToShow);
  }, []);

  // Fetch genres if this is the songs section
  useEffect(() => {
    if (isSongsSection) {
      const fetchGenres = async () => {
        try {
          const response = await axios.get('https://qtify-backend.labs.crio.do/genres');
          // Handle both direct array and nested data structure
          const genresData = Array.isArray(response.data) ? response.data : response.data?.data || [];
          setGenres(genresData);
        } catch (err) {
          console.error('Error fetching genres:', err);
          setGenres([]);
        }
      };
      fetchGenres();
    }
  }, [isSongsSection]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(apiEndpoint);
        setItems(response.data);
        setError(null);
      } catch (err) {
        console.error(`Error fetching data from ${apiEndpoint}:`, err);
        setError(`Failed to load ${title}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiEndpoint, title]);

  const handleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const handleShowAll = () => {
    setCollapsed(false);
    if (onShowAllClick) {
      onShowAllClick();
    }
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  // Filter items by selected genre
  const getFilteredItems = () => {
    if (!isSongsSection || genres.length === 0) {
      return items;
    }
    
    if (selectedTab === 0) {
      // "All" tab
      return items;
    }
    
    const selectedGenre = genres[selectedTab - 1];
    return items.filter(item => item.genre?.key === selectedGenre.key);
  };

  if (error) return <div className={styles.section}>{error}</div>;

  const filteredItems = getFilteredItems();
  // Show cards that fit in window when collapsed, all when expanded
  const displayItems = !loading ? (collapsed ? filteredItems.slice(0, cardsToShow) : filteredItems) : [];

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.heading}>{title}</h2>
        {!isSongsSection && (
          <button
            className={styles.collapseButton}
            onClick={handleCollapse}
          >
            {collapsed ? "Show All" : "Collapse"}
          </button>
        )}
      </div>

      {isSongsSection && (
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          className={styles.tabs}
          variant="scrollable"
          scrollButtonsDisplay="auto"
        >
          <Tab label="All" className={styles.tab} />
          {genres.map((genre) => (
            <Tab key={genre.key} label={genre.label} className={styles.tab} />
          ))}
        </Tabs>
      )}

      {loading ? (
        <div>Loading {title}...</div>
      ) : (
        <div className={styles.swiperContainer}>
          <Swiper
            ref={swiperRef}
            modules={[Navigation]}
            spaceBetween={20}
            slidesPerView="auto"
            navigation={{
              nextEl: `.${styles.swiperNextButton}`,
              prevEl: `.${styles.swiperPrevButton}`,
            }}
            className={styles.swiper}
          >
            {displayItems.map((item) => (
              <SwiperSlide key={item.id} className={styles.swiperSlide}>
                <Card
                  image={item.image}
                  title={item.title}
                  follows={item.follows}
                  likes={item.likes}
                  showLikes={showLikes}
                />
              </SwiperSlide>
            ))}
          </Swiper>
          
          <button className={`${styles.swiperPrevButton} ${styles.navButton}`}>
            &#10094;
          </button>
          <button className={`${styles.swiperNextButton} ${styles.navButton}`}>
            &#10095;
          </button>
        </div>
      )}
    </div>
  );
}

export default Section;
