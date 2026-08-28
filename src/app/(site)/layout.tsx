import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CartProvider } from '@/components/CartProvider';
import WhatsAppFab from '@/components/WhatsAppFab';
import SiteFrame from '@/components/SiteFrame';
import PageTransition from '@/components/PageTransition';
import { currentUser } from '@/lib/auth';

/**
 * Chrome for every page. SiteFrame supplies the shared cinematic backdrop, the
 * dark theme scope and the global MotionConfig; PageTransition handles the
 * route-change entrance.
 */
// The session is resolved once here and handed to the header, so the nav does
// not have to fetch it on the client.
export const dynamic = 'force-dynamic';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  return (
    <CartProvider>
      <SiteFrame>
        <Header user={user} />
        <main>
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
        <WhatsAppFab />
      </SiteFrame>
    </CartProvider>
  );
}
