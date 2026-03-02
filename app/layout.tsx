import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trade with Shafy",
  description: "Financial Trading Education & Research Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: '#080d2b', color: 'white', margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
