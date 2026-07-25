import type { Metadata, Viewport } from "next";
import { Inter, Poppins, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { BootstrapClient } from "@/components/BootstrapClient";
import { PwaRegister } from "@/components/PwaRegister";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://rurallysmile-org.vercel.app";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "Pratibha Khoj",
  title: {
    default: "Pratibha Khoj Competition 2026 | Rurally Smile Foundation",
    template: "%s | Pratibha Khoj 2026",
  },
  description:
    "Official Online Exam Portal for Pratibha Khoj Competition 2026 by Rurally Smile Foundation. Register, download admit card, and check results. Exam centre: Utkramit Uchch Vidyalaya, Ratnpura, Siwan, Bihar.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Pratibha Khoj",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Pratibha Khoj Competition 2026",
    description: "Talent Search Competition by Rurally Smile Foundation",
    type: "website",
    locale: "hi_IN",
    siteName: "Rurally Smile Foundation",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Pratibha Khoj Competition 2026",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0F766E",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="hi"
      className={`${inter.variable} ${poppins.variable} ${robotoMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-body">
        <BootstrapClient />
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
