import "./ui/globals.css";

import AuthProvider from "./context/auth-provider";
import Header from "./ui/header";
import type { Metadata } from "next";
import { poppins } from "./ui/fonts";

export const metadata: Metadata = {
  title: "Recipiz",
  description: "All-in-one marketplace for cookbooks and recipes.",
  icons: {
    icon: '/favicon.svg',
  },
  alternates: {
    canonical: 'https://myrecipiz.com/',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        <AuthProvider>
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
