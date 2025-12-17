import type { Metadata } from "next";
import { Inter, Libre_Baskerville, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// 1. Body Font (Clean, readable sans-serif)
const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans", 
  display: "swap",
});

// 2. Heading Font (Matches the 'font-serif' class used in your pages)
const serif = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-serif",
  display: "swap",
});

// 3. Technical Font (For code blocks and tags)
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shejal Tiwari | AI Engineer",
  description: "Portfolio of Shejal Tiwari, specializing in AI/ML and Full Stack Engineering.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 4. Added 'suppressHydrationWarning' to fix the error you saw earlier
    <html 
      lang="en" 
      suppressHydrationWarning 
      className={`${inter.variable} ${serif.variable} ${mono.variable}`}
    >
      <body className="bg-white text-slate-900 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}