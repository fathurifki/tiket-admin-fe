import "./globals.css";
import { Comic_Neue } from "next/font/google";
import LayoutProfile from "../components/layouts/LayoutProfile";
import '@radix-ui/themes/styles.css';

const comicNeue = Comic_Neue({
  weight: ["400", "700"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({ children }) {
  return <LayoutProfile className={comicNeue.className}>{children}</LayoutProfile>;
}
