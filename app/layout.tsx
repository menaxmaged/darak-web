import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import { Providers } from "@/lib/providers/query-provider";
import { ToastProvider } from "@/components/toast-provider";
import "./globals.css";
import { Header } from "@/components/Layout/Header";
import { Footer } from "@/components/Layout/Footer";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Darak Dashboard",
  description: "Darak is Egypt's premier real estate marketplace for buying properties. Explore our dashboard to manage your listings, view analytics, and connect with potential buyers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.svg" sizes="any" />
      </head>
      <body className={`${outfit.variable} ${inter.variable} antialiased`}>
        <Providers>
          <div className="min-h-screen flex flex-col">
          {children}
          </div>
          <ToastProvider />
        </Providers>
      </body>
    </html>
  );
}
