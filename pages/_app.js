// pages/_app.js
import '../styles/globals.css'; // Import global CSS

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      {/* Import Marhey font from Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Marhey:wght@400;700&display=swap" rel="stylesheet" />
      <Component {...pageProps} />
    </>
  );
}