export default function Home() {
  return (
    <div
      style={{
        backgroundImage: 'url(/BAGUIO.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.85)', // semi-transparent white
          padding: '40px',
          borderRadius: '12px',
          maxWidth: '600px',
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        }}
      >
        <h1 style={{ marginBottom: '20px' }}>Welcome to BagRovr</h1>
        <p style={{ marginBottom: '20px', fontSize: '1.1em' }}>
          Discover curated articles about Baguio City.
        </p>
        <a
          href="/articles"
          style={{
            display: 'inline-block',
            color: '#f7c94a',
            fontWeight: 'bold',
            fontSize: '1.1em',
            marginBottom: '16px',
            padding: '10px 20px',
            borderRadius: '6px',
            background: '#e3eafe',
            textDecoration: 'none',
          }}
        >
          Browse Articles →
        </a>
        <br />
        <a
          href="https://bagrovr.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            color: '#fff',
            background: '#edc75f',
            fontWeight: 'bold',
            fontSize: '1.1em',
            marginTop: '12px',
            padding: '10px 20px',
            borderRadius: '6px',
            textDecoration: 'none',
          }}
        >
          AI Powered Itinerary Maker →
        </a>
      </div>
    </div>
  );
}
