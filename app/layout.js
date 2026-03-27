import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./Components/Navbar";
import { ViewTransitions } from "next-view-transitions";
import LenisProvider from "./LenisProvider";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Sai Kiran & Bhumika",
  description: "A cinematic wedding archive",
};

export default function RootLayout({ children }) {
  const textureUrl = "https://plus.unsplash.com/premium_photo-1667811951673-3b3e8d6742c7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bm9pc2UlMjB0ZXh0dXJlfGVufDB8fDB8fHww";

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative bg-[#faf7f2]">

        <ViewTransitions>
          <LenisProvider>

            {/* ── CINEMATIC TEXTURE OVERLAY ── */}
            <div
              className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.04] mix-blend-overlay transform-gpu"
              style={{
                backgroundImage: `url("${textureUrl}")`,
                backgroundRepeat: "repeat",
                backgroundSize: "250px", // Maintains a fine-grain look
              }}
            />

            {/* ── VIGNETTE ── */}
            <div className="fixed inset-0 pointer-events-none z-[1] bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.05)_100%)]" />

            <Navbar />

            <main className="relative z-0">
              {children}
            </main>

          </LenisProvider>
        </ViewTransitions>
        <Analytics />
      </body>
    </html>
  );
}