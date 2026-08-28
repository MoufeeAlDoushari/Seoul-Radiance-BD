'use client';

import './hero-landing.css';
import { site } from '@/data/site';

// Loopstack template assets (getlayers.ai public bucket).
const ASSET_BASE =
  'https://api.getlayers.ai/storage/v1/object/public/public/assets/loopstack-f8c64439bf';

// Split points for the two masked entrance reveals. Splitting in the markup
// rather than after mount keeps the server and client HTML identical.
const HERO_LINE_1 = ['Authentic', 'Korean', 'skincare,'];
const HERO_LINE_2 = ['imported', 'for', 'Bangladesh'];
const WORDMARK = 'Seoul Radiance';

export default function HeroLanding() {


  // Stagger runs continuously across both headline lines: 0.1s per word.
  let wordIndex = 0;
  const renderWord = (word: string) => {
    const delay = wordIndex++ * 0.1;
    return (
      <span className="word-wrapper" key={`${word}-${delay}`}>
        <span className="word-inner" style={{ animationDelay: `${delay}s` }}>
          {word}
        </span>
      </span>
    );
  };

  return (
    <section className="lp-hero" aria-label="Seoul Radiance BD">
      {/* soft black blob fading the video into the section */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${ASSET_BASE}/black_gradient.svg`}
        alt=""
        aria-hidden="true"
        className="top-gradient"
      />

      <div className="hero-content">
        <h1 className="hero-title">
          {HERO_LINE_1.map((w, i) => (
            <span key={w}>
              {renderWord(w)}
              {i < HERO_LINE_1.length - 1 ? ' ' : null}
            </span>
          ))}
          <br />
          {HERO_LINE_2.map((w, i) => (
            <span key={w}>
              {renderWord(w)}
              {i < HERO_LINE_2.length - 1 ? ' ' : null}
            </span>
          ))}
        </h1>
        <a href="/shop" className="hero-btn">
          <span className="btn-text">Shop the collection</span>
          <span className="blinking-dot" />
        </a>
      </div>

      <div className="hero-meta">
        <div className="footer-top">
          <h2 className="footer-title">Stay in Touch</h2>
          <h2 className="footer-title quote">Cleanse. Hydrate. Glow.</h2>
        </div>

        <hr className="footer-divider" />

        <div className="footer-bottom">
          <div className="footer-socials">
            <a
              href={site.instagram}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Instagram"
              className="social-icon"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a
              href={site.facebook}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Facebook"
              className="social-icon"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a
              href={`https://wa.me/${site.whatsapp}`}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="WhatsApp"
              className="social-icon"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9" />
                <path d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1" />
              </svg>
            </a>
          </div>

          <nav className="footer-links">
            <a href="/about" className="footer-link">
              About
            </a>
            <a href="/shop" className="footer-link">
              Shop
            </a>
            <a href="/contact" className="footer-link">
              Delivery
            </a>
            <a href="/contact" className="footer-link">
              Contact
            </a>
          </nav>

          <div className="footer-copyright">© 2026 {site.name}</div>
        </div>
      </div>

      <div className="footer-logo-wrap">
        <h2 className="footer-logo-text">
          {[...WORDMARK].map((char, i) => (
            <span className="letter-wrapper" key={`${char}-${i}`}>
              <span className="letter-inner" style={{ animationDelay: `${i * 0.09}s` }}>
                {/* NBSP: a whitespace-only inline-block collapses to 0px,
                    which closed the gap in "Seoul Radiance". */}
                {char === ' ' ? ' ' : char}
              </span>
            </span>
          ))}
        </h2>
      </div>

      <div className="video-container">
        {/* src goes on the element, not a <source> child: React appends children
            after creating the <video>, by which point the browser has already
            run resource selection with no sources and parked at NETWORK_EMPTY. */}
        <video
          autoPlay
          muted
          playsInline
          loop
          preload="auto"
          className="bg-video"
          src={`${ASSET_BASE}/flower.mp4`}
        />
      </div>

      {/* hand-off into the plum marquee that opens the shop content */}
      <div className="hero-fade-out" aria-hidden="true" />

    </section>
  );
}
