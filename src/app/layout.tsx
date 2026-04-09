import type { Metadata, Viewport } from "next";
import { Syne, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  title: "Sofort. | Learn German Fast",
  description: "High-performance, offline-first German vocabulary companion for rapid acquisition.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Sofort.",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "Sofort. German Vocab",
    description: "Precision tool for German vocabulary acquisition.",
    type: "website",
    siteName: "Sofort",
  }
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${syne.variable} ${plexMono.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
