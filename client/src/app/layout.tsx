import type { Metadata } from "next";
import { Inter, Poppins, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { BootstrapClient } from "@/components/BootstrapClient";

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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.rurallysmile.org"
  ),
  title: {
    default: "Pratibha Khoj Competition 2026 | Rurally Smile Foundation",
    template: "%s | Pratibha Khoj 2026",
  },
  description:
    "Official Online Exam Portal for Pratibha Khoj Competition 2026 by Rurally Smile Foundation. Register, download admit card, and check results. Exam centre: Utkramit Uchch Vidyalaya, Ratnpura, Siwan, Bihar.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Pratibha Khoj Competition 2026",
    description: "Talent Search Competition by Rurally Smile Foundation",
    type: "website",
    locale: "hi_IN",
    siteName: "Rurally Smile Foundation",
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
        {children}
      </body>
    </html>
  );
}
