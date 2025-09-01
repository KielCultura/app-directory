export default function Home() {
  return (
    <main style={{ maxWidth: 600, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Welcome to BagRovr</h1>
      <p>
        Discover curated articles about Baguio City.<br />
        <a href="/articles" style={{ color: "#183ba8", fontWeight: "bold", fontSize: "1.2em" }}>
          Browse Articles →
        </a>
      </p>
    </main>
  );
}
