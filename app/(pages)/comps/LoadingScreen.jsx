import React from "react";
import Portal from "./Portal";
import LoadingMessage from "./LoadingMessage";

export default function LoadingScreen({ message }) {
  return (
    <Portal>
      <div className="w-full h-full backdrop-brightness-[0.25] flex justify-center items-center">
        {/* <div className="w-fit max-w-[80%] h-fit "></div> */}
        <LoadingMessage message={message} />
      </div>
    </Portal>
  );
}
