import type { Metadata } from "next";
import { Geist, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { siteConfig } from "@/config/site";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";
import { UserProvider } from "@/contexts/user-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Vita AI: Turn your ideas into powerful debates",
  description: "Vita AI is a platform that allows you to practice your debates. It uses AI to help you prepare for your debates and to help you win.",
  authors: [{ name: siteConfig.author, url: siteConfig.links.twitter }],
  creator: siteConfig.author,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    images: "/opengraph-image.png",
  },
  icons: {
    icon: "/favicon.ico",
  },
  keywords: ["Debate", "Debating", "Debate AI", "Debate Platform", "Debate Preparation", "Debate Training", "Debate Skills", "Debate Strategies", "Debate Tips", "Debate Techniques", "Debate Training", "Debate Preparation", "Debate Strategies", "Debate Tips", "Debate Techniques"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-dvh bg-background font-sans antialiased",
          geistSans.variable,
          instrumentSerif.variable
        )}
      >
        <UserProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <div className="relative min-h-dvh bg-background">
              <main className="">
                {children}
              </main>
            </div>
            <Toaster />
          </ThemeProvider>
        </UserProvider>
        <Analytics />
      </body>
    </html>
  );
}
