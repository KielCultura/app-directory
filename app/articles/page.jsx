"use client";

import { useEffect, useState } from "react";
import ArticleCard from '../../components/ArticleCard';

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/articles/articles.json")
      .then((res) => res.json())
      .then((data) => {
        setArticles(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load articles:", err);
        setLoading(false);
      });
  }, []);

  return (
    <main style={{ maxWidth: 800, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>📰 Articles</h1>
      {loading ? (
        <p>Loading articles...</p>
      ) : articles.length === 0 ? (
        <p>No articles found.</p>
      ) : (
        articles.map((article, index) => (
          <ArticleCard key={index} article={article} />
        ))
      )}
    </main>
  );
}
