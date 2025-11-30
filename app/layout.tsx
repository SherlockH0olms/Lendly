import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "KOBİ Kredit Platforması - Kredit almağı bir klik qədər asan",
    description: "Azərbaycanda kiçik və orta sahibkarlara kredit tapmaq prosesini sadələşdirən AI əsaslı rəqəmsal fintech platforması",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="az">
            <body className="antialiased">
                {children}
            </body>
        </html>
    );
}
