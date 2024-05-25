import { Quicksand } from "next/font/google";

const quicksand = Quicksand({
  display: "swap",
  fallback: ["system-ui", "arial"],
  subsets: ["latin"],
});

export { quicksand };
