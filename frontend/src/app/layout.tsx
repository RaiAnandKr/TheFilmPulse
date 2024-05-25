import { Providers } from "./providers";
import "../styles/globals.css";
import { quicksand } from "~/styles/fonts";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={quicksand.className}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
