import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Root from "./root";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const metaurl = String(process.env?.METADATA_URL || "http://localhost:3000");

export const metadata = {
  metadataBase: new URL(metaurl),
  title: {
    default: "Prakerin Hub",
    template: "%s | Prakerin Hub",
  },
  siteName: "prakerinhub.id",
  description: "Sederhanakan Administrasi, Maksimalkan Potensi Praktik!",
  openGraph: {
    title: "Prakerin Hub",
    description: "Sederhanakan Administrasi, Maksimalkan Potensi Praktik!",
    url: metaurl,
    siteName: "Prakerin Hub",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "image",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prakerin Hub",
    description: "Sederhanakan Administrasi, Maksimalkan Potensi Praktik!",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Root>{children}</Root>
        <script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          async
          defer
        ></script>
      </body>
    </html>
  );
}
