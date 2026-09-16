import type { Metadata } from "next";
import { DM_Sans, Dancing_Script } from "next/font/google";
import "./globals.css";

const sans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });
const script = Dancing_Script({
  subsets: ["latin"],
  weight: "500",
  variable: "--font-script",
});

export const metadata: Metadata = {
  title: "Mojito | A little sip of sunshine",
  description:
    "Find your fresh favorite. Explore Orange, Watermelon, Lime and Blackberry with Mojito.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${script.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
