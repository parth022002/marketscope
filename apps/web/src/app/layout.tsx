import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://marketscope.io"),
  title: "MarketScope.io — Financial Research & Intelligence",
  description: "An evidence-backed, research-first financial intelligence workspace for Indian and global equities.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo-icon.png", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: "MarketScope.io — Financial Research & Intelligence",
    description: "An evidence-backed, research-first financial intelligence workspace for Indian and global equities.",
    images: [{ url: "/logo-full.png", width: 1024, height: 220, alt: "MarketScope.io" }],
    siteName: "MarketScope.io",
  },
  twitter: {
    card: "summary_large_image",
    title: "MarketScope.io — Financial Research & Intelligence",
    description: "An evidence-backed, research-first financial intelligence workspace for Indian and global equities.",
    images: ["/logo-full.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/logo-icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="antialiased selection:bg-blue-600 selection:text-white" suppressHydrationWarning>
        <ClerkProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
