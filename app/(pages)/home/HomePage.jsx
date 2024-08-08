import React from "react";
import HelpCard from "./HelpCard";
import Portal from "../comps/Portal";
import HelpButton from "./HelpButton";
import HelpListSection from "./HelpListSection";
import ArmyContact from "../comps/ArmyContact";

export default function HomePage() {
  return (
    <div className="w-screen h-screen max-h-screen p-4 md:p-10">
      <div
        className="w-full h-full md:grid md:grid-cols-2 
      flex flex-col gap-4 justify-between  overflow-hidden"
      >
        <div className="w-full h-[30%] md:h-full  flex flex-col gap-4 justify-start items-center">
          <div className="w-full h-full flex flex-col">
            <div className="w-full grow flex md:flex-col">
              <img
                src="/images/bd_flag_rect.webp"
                alt="image"
                className="md:w-full w-60 md:max-w-2xl h-fit object-contain"
              />
              <div className="w-full h-full flex flex-col md:gap-2 text-center justify-center">
                <h2 className="text-lg md:text-2xl">একে অপরকে সাহায্য করি</h2>
                <p className="text-xl md:text-4xl text-white">
                  সন্ত্রাসমুক্ত বাংলাদেশ গড়ি
                </p>

                <div className="w-full h-fit block md:hidden">
                  <ArmyContact />
                </div>
              </div>
            </div>
            <HelpButton />
            <div className="w-full h-fit hidden md:block">
              <div className="w-full h-fit pt-4">
                <ArmyContact />
              </div>
            </div>
          </div>

          {/* <div className="w-full flex flex-col gap-1 tracking-wide">
          <p>
            ইনশাআল্লাহ, স্বাধীন বাংলাদেশে সকল সন্ত্রাসকে বিচারের আয়তায় আনা হবেই।
            তবে আইন নিজের কাঁধে তুলে নিয়ে কিছু স্বার্থ অন্বেষীদের এর সুযোগ নিতে
            দিবেন না।
          </p>
          <div className="w-full flex flex-col">
            <p>
              দীনের ব্যাপারে যারা তোমাদের সাথে যুদ্ধ করেনি, আর তোমাদেরকে তোমাদের
              ঘর-বাড়ী থেকে বের ক’রে দেয়নি তাদের সঙ্গে সদয় ব্যবহার করতে আর
              ন্যায়নিষ্ঠ আচরণ করতে আল্লাহ নিষেধ করেন নি। আল্লাহ ন্যায়পরায়ণদেরকে
              ভালবাসেন।
            </p>
            <p className="w-full text-end">- আল-মুমতাহিনাঃ ৮</p>
          </div>
          <p>
            ৮৫%+ মুসলিমের দেশে পাবলিক এড়িয়া গুলতে বিভিন্ন মূর্তির যথাযথ
            ব্যাবস্থ্যা নিবেন বলে আমরা নতুন সরকারের প্রতি আশাবাদী।
          </p>
        </div> */}
        </div>

        <div
          className="w-full h-[65%] md:h-full 
      flex flex-col justify-start items-center gap-2"
        >
          <HelpListSection />
        </div>
      </div>
    </div>
  );
}
