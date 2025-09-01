export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, fontFamily: "sans-serif", background: "#fff", color: "#000" }}>
        {children}
      </body>
    </html>
  );
}
