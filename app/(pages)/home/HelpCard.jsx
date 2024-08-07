"use client";
import React from "react";

export default function HelpCard({ info }) {
  const { details, phone, name, lat, lon, views, time, dist } = info;
  // const details =
  //   "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deserunt corrupti nesciunt doloremque quod incidunt dolores ipsam vel rerum, magni, animi deleniti eum aliquam aliquid, architecto sit? Eius quo numquam tempore debitis repudiandae suscipit adipisci expedita nam perspiciatis sapiente, iste, laudantium molestiae ex distinctio doloribus reiciendis. Hic asperiores, molestias eius nihil ab soluta error repudiandae eos minima vitae, repellat sequi doloribus deserunt alias facere voluptatum nobis aut quos culpa fugiat veritatis possimus magni doloremque nulla. In illum sunt at architecto iste, dicta, officiis cumque officia quia dolore earum alias suscipit et cupiditate est, soluta quae reprehenderit inventore odit minus laudantium eaque amet voluptatem ipsum? Sapiente nemo debitis obcaecati quod distinctio natus commodi cupiditate. Impedit adipisci expedita ab eius debitis laudantium nihil ea id, esse excepturi ut dignissimos quos voluptate laboriosam omnis a officiis sed, quasi consectetur quo? Laudantium, praesentium atque tempora explicabo quibusdam modi. Voluptate tempora esse debitis magnam? Asperiores explicabo cumque ea quam beatae delectus voluptates dolores at? Sunt accusantium non excepturi earum aliquid aut iure cupiditate! Vitae repellendus, non corrupti cumque ipsum doloribus accusamus dicta vel sapiente aut veritatis sit distinctio deserunt iste dolore neque, fugit explicabo odit reprehenderit earum, sint dignissimos ducimus officiis. Laborum molestiae porro libero tempora, eius soluta voluptatum, sapiente nemo laudantium autem fugiat veritatis doloremque unde ipsa? Obcaecati dolorum itaque reprehenderit aut, distinctio sapiente optio explicabo nesciunt earum nam nobis sed at. Sit, officiis qui tempore molestias voluptate magnam maxime eum, doloremque quibusdam optio illum esse cumque? Porro dolorum fuga repellendus quidem amet non tenetur minus odit laborum obcaecati reprehenderit, dolore quia nostrum rem repellat magnam assumenda quasi. Adipisci explicabo, ab voluptate minima, dolorum dignissimos neque placeat pariatur saepe assumenda et commodi ut. Soluta dolores perspiciatis ullam, nihil culpa voluptatem commodi quisquam ab et nostrum temporibus exercitationem aut quasi a velit voluptates. Magni dignissimos quidem voluptate assumenda vel, ipsa necessitatibus asperiores doloremque eius quibusdam sit, quasi nemo nesciunt, cum expedita. Quod quidem officiis, omnis, soluta, magni deleniti quis impedit cumque velit doloremque sequi voluptatum ullam placeat perspiciatis perferendis hic corrupti vitae adipisci laborum amet laudantium ipsam suscipit id sint? Sint libero repellat quidem sit amet maiores ex illum reiciendis natus nihil, ratione voluptatum odio, modi officiis tempora, perspiciatis laudantium repellendus explicabo esse. Adipisci voluptates iure quidem recusandae earum ipsa aspernatur. Cum ad laboriosam, ullam beatae facere eveniet aperiam, illo quia est, error iusto magnam nobis! Maxime odio quaerat ut voluptatem ullam, harum repellat facilis, eligendi alias accusantium inventore tenetur veniam necessitatibus illo magni, deserunt sint ipsa architecto. Dolore, eveniet pariatur maiores possimus molestiae vero animi modi rem aut voluptatum officia magni corporis labore et quo cumque minima nostrum ipsum dolores mollitia eos laudantium voluptates quod! Officiis ipsa cupiditate voluptate enim sed nemo, odit cum harum, aperiam tempora perferendis doloremque, natus obcaecati libero ab magni accusantium? Iure sint corrupti laborum deserunt beatae libero consequuntur provident porro dolorem quisquam. Cum, praesentium, beatae fuga saepe, voluptas id in omnis voluptatum consequuntur voluptates sint quae odio dolore earum placeat nihil libero iste perspiciatis ipsa deserunt quidem laboriosam! Modi, non!";

  // const phone = "01771496694";
  // const name = "Nayeemur Rahman";

  // const views = 15;
  // const lat = 23.810097;
  // const lon = 90.431327;

  const openMap = () => {
    const url = `https://www.google.com/maps?q=${lat},${lon}`;
    window.open(url, "_blank");
  };

  return (
    <div className="w-full h-32 flex flex-row gap-2 p-2 bg-neutral-800 rounded-xl">
      {/* <img
        src="/images/bd_flag_rect.webp"
        alt="situation image"
        className="w-24 md:w-44 h-full object-contain"
      /> */}
      <div className="w-full h-full flex flex-col gap-2 justify-between">
        <h2 className="text-xs tracking-wider">
          {!details
            ? "জরুরী সাহায্যের প্রয়োজন"
            : details.length > 250
            ? `${details.substring(0, 251)}...`
            : details}
        </h2>

        <div className="w-full flex text-sm justify-between items-end">
          <div className="w-fit flex flex-col text-white">
            <h2 className="font-bold">
              {name.length > 25 ? `${name.substring(0, 26)}...` : name}
            </h2>
            <h2 className="font-bold">{phone}</h2>
          </div>

          <div className="w-fit flex flex-col">
            <h2>দেখেছেন: {views}</h2>

            <h2>দূরত্ব: {dist?.toFixed(2)} কি.মি.</h2>
            <h2>রিকোয়েস্ট করেছেন: {time} মিনিট আগে</h2>
          </div>

          <button
            onClick={() => {
              openMap();
            }}
            className="bg-red-500 rounded-md w-40 pt-2 pb-1 font-bold"
          >
            View location
          </button>
        </div>
      </div>
    </div>
  );
}
