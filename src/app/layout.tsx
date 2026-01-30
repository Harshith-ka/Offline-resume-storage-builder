import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Resume Forge — Premium Offline Resume Builder",
  description:
    "Apple Notes + Canva + AI — but for resumes. Offline-first, student & fresher templates, ATS-optimized.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${outfit.variable} ${jetbrainsMono.variable} font-sans min-h-screen bg-background text-foreground`}
      >
        <div className="grain" aria-hidden />
        {children}
      </body>
    </html>
  );
}
