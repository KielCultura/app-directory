import { useState } from "react";

export default function SearchBar({ articles, onResults }) {
  const [search, setSearch] = useState("");

  function handleChange(e) {
    const query = e.target.value.toLowerCase();
    setSearch(e.target.value);

    // Filter by title, summary/content, or tags (case-insensitive)
    const filtered = articles.filter(article => {
      const inTitle = article.title.toLowerCase().includes(query);
      const inSummary = (article.summary || "").toLowerCase().includes(query);
      const inTags = article.tags && article.tags.some(tag => tag.toLowerCase().includes(query));
      return inTitle || inSummary || inTags;
    });

    onResults(filtered);
  }

  return (
    <input
      type="text"
      value={search}
      placeholder="Search articles..."
      onChange={handleChange}
    />
  );
}
