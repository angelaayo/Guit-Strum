import type { Metadata } from "next";
import { Inter, Source_Serif_4, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { getCurrentUser } from "@/app/lib/auth";
import { Providers } from "@/app/lib/providers";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif-4",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GuitStrum",
  description: "Learn chords by actually playing them.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const user = await getCurrentUser();

  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        sourceSerif.variable,
        inter.variable,
        "font-sans",
        geist.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <Providers user={user}>{children}</Providers>
      </body>
    </html>
  );
}
