import type { Metadata } from "next";
import { Orbitron, Manrope } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "WhatsApp Poll Extractor",
  description: "Manage and extract WhatsApp Polls efficiently.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-manrope bg-slate-50 text-slate-900">{children}</body>
    </html>
  );
}
