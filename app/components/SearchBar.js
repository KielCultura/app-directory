import { useState } from "react";
export default function SearchBar({ articles, onResults }) {
  const [search, setSearch] = useState("");

  function handleChange(e) {
    const query = e.target.value.toLowerCase();
    setSearch(e.target.value);

    const filtered = articles.filter(article => {
      const inTitle = article.title.toLowerCase().includes(query);
      const inSummary = (article.summary || "").toLowerCase().includes(query);
      const inTags = article.tags && article.tags.some(tag => tag.toLowerCase().includes(query));
      return inTitle || inSummary || inTags;
    });

    onResults(filtered);
  }

  return (
    <>
      {/* Import Comfortaa font using a style tag */}
      <style>{`
        @import url('https://fonts.googleapis.com/css?family=Comfortaa:400,700&display=swap');
      `}</style>
      <input
        type="text"
        value={search}
        placeholder="Search articles..."
        onChange={handleChange}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "20px",
          borderRadius: 6,
          border: "1px solid #e2e4ed",
          fontSize: "1em",
          fontFamily: "'Comfortaa', Arial, sans-serif"
        }}
      />
    </>
  );
}
