import { Outfit } from "next/font/google";
import "./globals.css";
import Provider from "./provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner"

const outfit = Outfit({ subsets: ["latin"] });

export const metadata = {
  title: "AI-PDF-Note-Maker",
  description: "Used to Generate Notes from AI and PDF ",
  icons: {
    icon: "/logo.svg",
  }
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={outfit.className}>
          <Provider>{children}</Provider>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
