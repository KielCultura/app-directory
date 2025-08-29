// For Next.js 13+ App Router (app/articles/page.jsx)
import { useState } from "react";

// Helper to fetch articles.json at build time (for production) or runtime (for dev)
async function getArticles() {
  const res = await fetch("/articles/articles.json");
  return res.json();
}

export default function ArticlesPage() {
  const [query, setQuery] = useState("");
  const [articles, setArticles] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // Load articles on first render
  React.useEffect(() => {
    getArticles().then(data => {
      setArticles(data);
      setLoaded(true);
    });
  }, []);

  const filtered = articles.filter(article => {
    const q = query.toLowerCase();
    return (
      article.title.toLowerCase().includes(q) ||
      (article.summary && article.summary.toLowerCase().includes(q)) ||
      (article.tags && article.tags.join(" ").toLowerCase().includes(q))
    );
  });

  return (
    <div style={{maxWidth:600,margin:"30px auto",fontFamily:"sans-serif"}}>
      <h1>Explore Baguio Articles</h1>
      <input
        type="text"
        value={query}
        onChange={e=>setQuery(e.target.value)}
        placeholder="Search by title, tag, or summary..."
        style={{width:"100%",padding:10,marginBottom:20,fontSize:"1.1em"}}
      />
      {!loaded ? (
        <div>Loading articles...</div>
      ) : (
        <ul style={{padding:0}}>
          {filtered.map((article, i) => (
            <li key={i} style={{
              marginBottom:18,background:"#fafdff",borderRadius:8,
              padding:14,border:"1px solid #e2e4ed",listStyle:"none"
            }}>
              <a href={article.url} target="_blank" rel="noopener noreferrer"
                 style={{fontWeight:"bold", fontSize:"1.18em", color:"#183ba8"}}>
                {article.title}
              </a>
              <div style={{color:"#555",margin:"7px 0"}}>{article.summary}</div>
              <div style={{fontSize:"0.95em",color:"#4169e1"}}>
                {article.tags && article.tags.map(tag => (
                  <span key={tag} style={{
                    display:"inline-block",background:"#e3eafe",borderRadius:5,
                    padding:"2px 8px",marginRight:7,fontSize:"0.97em"
                  }}>{tag}</span>
                ))}
              </div>
            </li>
          ))}
          {filtered.length === 0 && <li>No articles found.</li>}
        </ul>
      )}
    </div>
  );
}
