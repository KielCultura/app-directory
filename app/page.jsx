export default function Home() {
  return (
    <main style={{ maxWidth: 600, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Welcome to BagRovr</h1>
      <p>
        Discover curated articles about Baguio City.<br />
        <a href="/articles" style={{ 
          display: "inline-block", 
          color: "#183ba8", 
          fontWeight: "bold", 
          fontSize: "1.2em", 
          marginTop: "20px",
          marginBottom: "12px",
          padding: "10px 20px",
          borderRadius: "6px",
          background: "#e3eafe",
          textDecoration: "none"
        }}>
          Browse Articles →
        </a>
      </p>
      <p>
        <a href="https://bagrovr.vercel.app" target="_blank" rel="noopener noreferrer" style={{ 
          display: "inline-block", 
          color: "#fff", 
          background: "#183ba8", 
          fontWeight: "bold", 
          fontSize: "1.2em", 
          marginTop: "10px", 
          padding: "10px 20px",
          borderRadius: "6px",
          textDecoration: "none"
        }}>
          AI Powered Itinerary Maker →
        </a>
      </p>
    </main>
  );
}
