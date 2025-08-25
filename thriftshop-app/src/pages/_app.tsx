import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/hooks/useCart";
import { WishlistProvider } from "@/hooks/useWishlist";
import { NotificationProvider } from '@/context/NotificationContext';
import Notification from '@/components/Notification';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <CartProvider>
        <WishlistProvider>
          <NotificationProvider>
            <Component {...pageProps} />
            <Notification />
          </NotificationProvider>
        </WishlistProvider>
      </CartProvider>
    </SessionProvider>
  );
}
