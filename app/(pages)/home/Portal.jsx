"use client";
import { useEffect, useId } from "react";
import { createPortal } from "react-dom";

const Portal = ({ children, portalId, id, disablePointerEvents }) => {
  const reactId = useId();

  if (typeof document === "undefined") {
    return (
      <div
        id={id || reactId}
        style={{
          pointerEvents: disablePointerEvents ? "none" : "auto",
        }}
        className="absolute top-0 left-0 w-screen h-screen font-text z-50"
      >
        {children}
      </div>
    );
  }
  const el = document?.createElement("div");

  useEffect(() => {
    if (!el) {
      return;
    }
    const mount = document?.getElementById(portalId || "portal-1");
    mount.appendChild(el);
    return () => mount.removeChild(el);
  }, [el]);

  if (!el) {
    return;
  }

  return createPortal(
    <div
      style={{
        pointerEvents: disablePointerEvents ? "none" : "auto",
      }}
      id={id || reactId}
      className="absolute top-0 left-0 w-screen h-screen font-text z-50"
    >
      {children}
    </div>,
    el
  );
};

export default Portal;
