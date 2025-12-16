import React, { useState, useEffect } from "react";
import Card from "../Card/Card";
import styles from "./Cards.module.css";

function Cards() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://qtify-backend.labs.crio.do/albums/top"
        );
        const data = await response.json();
        setAlbums(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching albums:", err);
        setError("Failed to load albums");
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, []);

  if (loading) return <div className={styles.container}>Loading albums...</div>;
  if (error) return <div className={styles.container}>{error}</div>;

  return (
    <div className={styles.section}>
      <h2 className={styles.heading}>Top Albums</h2>
      <div className={styles.container}>
        {albums.map((album) => (
          <Card
            key={album.id}
            image={album.image}
            title={album.title}
            follows={album.follows}
          />
        ))}
      </div>
    </div>
  );
}

export default Cards;
