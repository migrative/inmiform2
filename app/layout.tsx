import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Inmiform - Immigration Document Processor",
  description: "AI-powered document processor for USCIS immigration forms",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
