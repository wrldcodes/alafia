import type { Metadata } from "next";
import "./globals.css";

const baseUrl = "https://alafia-ara.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Aláfíà ",
    template: "Health",
  },

  // ── Core SEO ───────────────────────────────────────────────────────────
  description: "Aláfíà connects patients ",

  keywords: [
    "clinic management Nigeria",
    "patient portal Nigeria",
    "community health platform",
    "rural healthcare Nigeria",
    "book doctor appointment Nigeria",
    "health records online",
    "appointment scheduling clinic",
    "NHIS health platform",
    "healthcare access Nigeria",
  ],

  authors: [{ name: "Aláfíà Health", url: baseUrl }],
  creator: "Aláfíà Health",
  publisher: "Aláfíà Health",
  applicationName: "Aláfíà",
  category: "Healthcare",

  openGraph: {
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Aláfíà — Health for Every Community",
        type: "image/png",
      },
    ],
  },
 
  // ── Twitter / X ────────────────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: "Aláfíà — Health for Every Community",
    description:
      "Connecting patients in local and rural communities to clinics near them.",
    images: ["/opengraph-image.png"], // relative — metadataBase handles it
    creator: "@alafiahealth",
    site: "@alafiahealth",
  },

  // ── Robots ─────────────────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ── Canonical ──────────────────────────────────────────────────────────
  // '/' is relative — metadataBase resolves it to https://alafia-ara.vercel.app/
  alternates: {
    canonical: "/",
  },

  // ── Verification ───────────────────────────────────────────────────────
  // Add your real code from Google Search Console once you verify the site.
  // Delete this line entirely until you have the real value.
  // verification: {
  //   google: 'your-real-code-here',
  // },

  // ── Format detection ───────────────────────────────────────────────────
  // Prevents iOS from auto-linking phone numbers, emails, addresses in UI text
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  // ── PWA / Apple ────────────────────────────────────────────────────────
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Aláfíà",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-NG">
      {" "}
      {/* en-NG for Nigerian English */}
      <body>{children}</body>
    </html>
  );
}
