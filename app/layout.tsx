import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { Providers } from "@/lib/providers/query-provider";
import { ToastProvider } from "@/components/toast-provider";
import "./globals.css";
import { Header } from "@/components/Layout/Header";
import { Footer } from "@/components/Layout/Footer";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "700"],
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
      <body
        className={`${montserrat.variable} antialiased`}
      >
        <Providers>
            <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  
          <ToastProvider />
        </Providers>
      </body>
    </html>
  );
}
