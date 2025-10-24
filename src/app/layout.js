import { Geist, Geist_Mono } from "next/font/google";
import { ReactQueryProvider } from "@/components/provider/ReactQueryProvider";
import { PrimeProvider } from "@/components/provider/PrimeProvider";

import "./globals.css";
import "primereact/resources/primereact.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Search Map",
  description: "Search Map",
  icons: {
    icon: "/images/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReactQueryProvider>
          <PrimeProvider>{children}</PrimeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
