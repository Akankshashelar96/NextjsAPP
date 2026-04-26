import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Open Slate VFX | Visual Effects & Virtual Production Studio",
  description: "Open Slate is a cutting-edge VFX studio specializing in visual effects, virtual production, 3D assets creation, concept art, and shoot supervision for films, TVC, and OTT platforms.",
  keywords: "VFX, Visual Effects, Virtual Production, 3D Assets, Concept Art, Film VFX, LED Volume, Real-time VFX, Unreal Engine, Houdini",
  authors: [{ name: "Open Slate VFX" }],
  openGraph: {
    title: "Open Slate VFX | Visual Effects & Virtual Production Studio",
    description: "Creating in-camera visual effects for virtual production. We deal with fluids, particles, explosions, and make them look photo-real.",
    type: "website",
    locale: "en_US",
    siteName: "Open Slate VFX",
  },
  twitter: {
    card: "summary_large_image",
    title: "Open Slate VFX | Visual Effects & Virtual Production Studio",
    description: "Creating in-camera visual effects for virtual production. We deal with fluids, particles, explosions, and make them look photo-real.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#050505" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
