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
      </body>
    </html>
  );
}

