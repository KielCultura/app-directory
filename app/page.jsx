import ArticleCard from "../components/ArticleCard";

const articles = [
  {
    title: "Smart Tourism in Baguio",
    content: "Baguio City is integrating real-time APIs to enhance tourist experiences...",
    tags: ["tourism", "tech", "Baguio"]
  },
  {
    title: "Local Cuisine Spotlight",
    content: "From strawberry taho to Cordilleran etag, Baguio’s food scene is rich and diverse...",
    tags: ["food", "culture"]
  }
];

export default function ArticlesPage() {
  return (
    <main style={{ maxWidth: 800, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>📰 Articles</h1>
      {articles.map((article, index) => (
        <ArticleCard key={index} article={article} />
      ))}
    </main>
  );
}
