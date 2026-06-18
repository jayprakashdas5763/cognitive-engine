import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cognitive AI Agent | World-Class Interface",
  description:
    "Production-ready cognitive AI agent interface with real-time thinking visualization",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-space text-white antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
