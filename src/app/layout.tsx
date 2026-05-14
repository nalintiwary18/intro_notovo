import type { Metadata } from "next";
import { Josefin_Sans, Inter, Epilogue } from "next/font/google";
import SmoothScrolling from "./components/SmoothScrolling";
import "./globals.css";

const josefinSans = Josefin_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-josefin",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-inter",
});

const epilogue = Epilogue({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-epilogue",
});

export const metadata: Metadata = {
  title: "Notovo - Changing how notes are made.",
  description: "From Raw Material to Structured Notes",
  icons: {
    icon: [
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/favicon.ico", type: "image/x-icon" },
    ],
    apple: [{ url: "/favicon/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: [
      { url: "/favicon/favicon.ico" }
    ],
  },
  manifest: "/favicon/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${josefinSans.variable} ${inter.variable} ${epilogue.variable}`}>
      <body>
        <SmoothScrolling>{children}</SmoothScrolling>
        <div 
          id="wipe-block" 
          style={{
            position: "fixed",
            left: 0,
            width: "100%",
            height: "100vh",
            top: "-100vh",
            backgroundColor: "black",
            zIndex: 9999,
            pointerEvents: "none"
          }}
        />
      </body>
    </html>
  );
}

