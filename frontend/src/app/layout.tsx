"use client";

import { Providers } from "./providers";
import { quicksand } from "../styles/fonts";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import "../styles/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={quicksand.className}>
      <body>
        <Providers>
          <div className="flex h-screen flex-col justify-between">
            <Header />
            <div className="flex flex-auto">{children}</div>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
