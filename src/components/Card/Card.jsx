import React from "react";
import { Chip } from "@mui/material";
import styles from "./Card.module.css";

function Card({ image, title, follows, likes, showLikes = false }) {
  const displayValue = showLikes ? likes : follows;
  const displayLabel = showLikes ? "Likes" : "Follows";
  
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={image} alt={title} className={styles.image} />
      </div>
      <div className={styles.bottomSection}>
        <div className={styles.titleSection}>
          <p className={styles.title}>{title}</p>
        </div>
        <div className={styles.chipContainer}>
          <Chip
            label={`${displayValue} ${displayLabel}`}
            variant="outlined"
            size="small"
            className={styles.chip}
          />
        </div>
      </div>
    </div>
  );
}

export default Card;
