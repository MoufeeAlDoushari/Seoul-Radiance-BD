/** @type {import('next').NextConfig} */

/**
 * Security headers.
 *
 * The CSP is written against what this site actually loads:
 *   · Google Fonts stylesheets and font files (next/font and the hero CSS);
 *   · the getlayers.ai bucket, for the hero video and its gradient SVG;
 *   · inline styles, which Tailwind and Motion both emit at runtime;
 *   · 'unsafe-eval' in development only, for React Refresh.
 *
 * frame-ancestors 'none' replaces X-Frame-Options, which it supersedes.
 */
const isDev = process.env.NODE_ENV !== 'production';

const csp = [
  "default-src 'self'",
  // Next injects inline bootstrap scripts; React Refresh needs eval in dev.
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  'font-src \'self\' https://fonts.gstatic.com data:',
  "img-src 'self' data: blob: https:",
  'media-src \'self\' https://api.getlayers.ai',
  "connect-src 'self'" + (isDev ? ' ws: wss:' : ''),
  "form-action 'self'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
];

const nextConfig = {
  images: {
    // The starter product images are SVG placeholders. Next's optimizer refuses
    // SVG unless this is on; the CSP below keeps them inert (no scripts).
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Allows product photos hosted elsewhere (Cloudinary, Imgur, your CDN…).
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },

  async headers() {
    return [
      {
        // Everything except Next's own static assets, which are immutable and
        // already served with their own caching headers.
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
