'use client';

import { site } from '@/data/site';

export default function WhatsAppFab() {
  const msg = encodeURIComponent(
    'Hi Seoul Radiance BD! I would like to know more about your skincare products.',
  );

  return (
    <a
      href={`https://wa.me/${site.whatsapp}?text=${msg}`}
      target="_blank"
      rel="noreferrer noopener"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg shadow-plum/25 transition-transform hover:scale-105"
    >
      <svg width="27" height="27" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm5.3 14c-.2.6-1.2 1.2-1.7 1.2-.5.1-1 .1-1.7-.1a12 12 0 0 1-5.6-4.9c-.4-.7-.7-1.5-.7-2.2 0-.8.4-1.5.8-1.8.2-.2.4-.3.6-.3h.5c.2 0 .4 0 .6.4l.8 1.9c.1.2 0 .4-.1.5l-.4.5c-.1.2-.3.3-.1.6.5.8 1 1.4 1.7 1.9.5.4.8.5 1 .3l.6-.7c.2-.2.4-.2.6-.1l1.8.9c.2.1.3.2.4.3 0 .1 0 .5-.1.7Z" />
      </svg>
    </a>
  );
}
