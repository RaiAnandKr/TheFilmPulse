"use client";

import { Providers } from "./providers";
import { quicksand } from "../styles/fonts";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { useSyncDocHeight } from "../hooks/useSyncDocHeight";
import "../styles/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useSyncDocHeight();

  return (
    <html lang="en" className={quicksand.className}>
      <body>
        <Providers>
          <div
            className="flex h-screen flex-col justify-between"
            id="appContainer"
          >
            <Header />
            <div className="flex flex-auto flex-col">{children}</div>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
