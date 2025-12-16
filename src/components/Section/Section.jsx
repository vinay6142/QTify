import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "../Card/Card";
import styles from "./Section.module.css";

function Section({ title, apiEndpoint, showAll = false, onShowAllClick }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [collapsed, setCollapsed] = useState(true);

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

  if (loading) return <div className={styles.section}>Loading {title}...</div>;
  if (error) return <div className={styles.section}>{error}</div>;

  // Show limited cards when collapsed, all when expanded
  const displayItems = collapsed ? items.slice(0, 6) : items;

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.heading}>{title}</h2>
        <button
          className={styles.collapseButton}
          onClick={handleCollapse}
        >
          {collapsed ? "Show All" : "Collapse"}
        </button>
      </div>

      <div className={styles.cardsContainer}>
        {displayItems.map((item) => (
          <Card
            key={item.id}
            image={item.image}
            title={item.title}
            follows={item.follows}
          />
        ))}
      </div>
    </div>
  );
}

export default Section;
