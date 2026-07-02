import type { Metadata } from "next";
import { ThemeProvider } from "@intelli/themes";
import { PlaygroundBackgroundProvider } from "../components/playground-background-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Intelli UI — Playground",
  description: "Glass morphism component library playground",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="mono" className="light" suppressHydrationWarning>
      <body className="min-h-screen antialiased px-4 pt-4">
        <ThemeProvider defaultTheme="mono" defaultMode="light">
          <PlaygroundBackgroundProvider>{children}</PlaygroundBackgroundProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}