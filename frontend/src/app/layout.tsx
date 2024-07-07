"use client";

import { Providers } from "./providers";
import { quicksand } from "../styles/fonts";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { useSyncDocHeight } from "../hooks/useSyncDocHeight";
import { OtplessSDK } from "~/constants/sdks";
import { usePreloadData } from "~/data/hooks/usePreloadData";
import { Banner } from "~/components/banner";

import "../styles/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useSyncDocHeight();

  return (
    <>
      <html lang="en" className={quicksand.className}>
        <head>
          <link rel="prefetch" href={OtplessSDK.prebuiltUISrc} as="script" />
        </head>
        <body>
          <Providers>
            <App>{children}</App>
          </Providers>
        </body>
      </html>
    </>
  );
}

const App = ({ children }: { children: React.ReactNode }) => {
  usePreloadData();

  return (
    <>
      <div className="flex h-screen flex-col justify-between" id="appContainer">
        <Header />
        <div className="flex flex-auto flex-col">{children}</div>
        <Footer />
      </div>
      <Banner />
    </>
  );
};
