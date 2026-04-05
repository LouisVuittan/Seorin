const GalleryItem = ({ g, idx }) => {
  return (
    <div
      className="gallery-card"
      style={{
        "--i": idx,
        "--hue": 22 + idx * 18,
        "--sat": 35 - idx * 2,
        "--light": 82 - idx * 4,
      }}
    >
      <div className="gallery-card-bg" aria-hidden="true">
        <span className="gallery-card-emoji">{g.emoji}</span>
      </div>
      <div className="gallery-card-glass">
        <span className="gallery-card-category">{g.category}</span>
        <span className="gallery-card-label">{g.label}</span>
      </div>
    </div>
  );
};

export default GalleryItem;
