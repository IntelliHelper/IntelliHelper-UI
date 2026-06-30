import type { Metadata } from "next";
import { ThemeProvider } from "@intelli/themes";
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
          <div className="mesh-background" aria-hidden="true">
            <div className="mesh-blob mesh-blob-1" />
            <div className="mesh-blob mesh-blob-2" />
            <div className="mesh-blob mesh-blob-3" />
          </div>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}