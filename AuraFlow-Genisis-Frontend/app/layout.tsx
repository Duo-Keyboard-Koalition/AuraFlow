import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./components/Navbar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "AuraFlow - Connecting Influencers and Brands",
  description: "AuraFlow connects the expressive energy of influencers with the intentional vision of brands.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-white`}
      >
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="bg-gray-800 text-white p-6 mt-12">
          <div className="container mx-auto text-center">
            <p>© {new Date().getFullYear()} AuraFlow. All rights reserved.</p>
            <p className="mt-2 text-gray-400 text-sm">Connecting influencer vibes with brand identities.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
