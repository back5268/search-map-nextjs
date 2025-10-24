import { ReactQueryProvider } from "@/components/provider/ReactQueryProvider";
import { PrimeProvider } from "@/components/provider/PrimeProvider";

import "./globals.css";
import "primereact/resources/primereact.css";

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
      <body className="antialiased">
        <ReactQueryProvider>
          <PrimeProvider>{children}</PrimeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
