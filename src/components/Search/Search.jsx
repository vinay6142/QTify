import React, { useState } from "react";
import styles from "./Search.module.css";
import { useNavigate } from "react-router-dom";
import { truncate } from "../../helpers/helpers";

function Search({ searchData, placeholder }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const filteredResults = searchData.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e, selectedItem) => {
    e.preventDefault();
    if (selectedItem) {
      navigate(`/album/${selectedItem.slug}`);
      setSearchTerm("");
      setShowDropdown(false);
    }
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setShowDropdown(true);
  };

  return (
    <div style={{ position: "relative" }}>
      <form className={styles.wrapper} onSubmit={(e) => e.preventDefault()}>
        <input
          className={styles.search}
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setShowDropdown(true)}
        />
        <button className={styles.searchButton} type="submit">
          🔍
        </button>
      </form>
      {showDropdown && filteredResults.length > 0 && (
        <ul className={styles.dropdown}>
          {filteredResults.map((item, index) => {
            const artists = item.songs?.reduce((acc, song) => {
              if (song.artists) acc.push(...song.artists);
              return acc;
            }, []) || [];

            return (
              <li
                key={index}
                className={styles.listElement}
                onClick={(e) => handleSubmit(e, item)}
              >
                <div>
                  <p className={styles.albumTitle}>{item.title}</p>
                  <p className={styles.albumArtists}>
                    {truncate(artists.join(", "), 40) || "Various Artists"}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default Search;
