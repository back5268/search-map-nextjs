import { Geist, Geist_Mono } from "next/font/google";
import { PrimeReactProvider } from "primereact/api";
import { ReactQueryProvider } from "@/components/provider/ReactQueryProvider";
import { Toastify } from "@/components/base/Toastify";

import "./globals.css";

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
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReactQueryProvider>
          <PrimeReactProvider value={{ ripple: true, inputStyle: "outlined" }}>
            <Toastify />
            {children}
          </PrimeReactProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
