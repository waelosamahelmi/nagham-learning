import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NaghamOS — Creative Growth Engine",
  description:
    "A gamified, AI-powered learning platform for creative professionals.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Fonts loaded via CSS - replace with next/font/google when deploying with internet access */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Syne:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
