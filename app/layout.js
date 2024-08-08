import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ডাকাত ধর",
  description: "আসুন সন্ত্রাসমুক্ত বাংলাদেশ গড়ি",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-neutral-200 font-ban`}>
        <div className="w-full h-full">{children}</div>
        <div id="portal-1"></div>
      </body>
    </html>
  );
}
