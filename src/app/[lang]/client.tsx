"use client";
import React, { useEffect, useState } from "react";

export default function IndexPageClient(props: { greetings: string }) {
  const { greetings } = props;
  const [isImageCached, setImageCached] = useState("false");

  useEffect(() => {
    // 从localstorage读取图片缓存状态
    const bgImageCachedStatus = localStorage.getItem("isImageCached");
    bgImageCachedStatus && setImageCached(bgImageCachedStatus);
  }, []);

  return (
    <React.Fragment>
      {/* <div
        className={`flex flex-1 flex-col ${
          isImageCached === "true"
            ? "pointer-events-auto visible opacity-100"
            : "pointer-events-none invisible opacity-0"
        }`}
      >
        <div className="Top flex flex-1 flex-col items-center justify-center">
          <h1 className="Title mx-8 -translate-y-1/4 border-b-2 p-10 text-center text-5xl font-extrabold tracking-tight lg:text-9xl">
            Toram <span className=" text-brand-color-1st">の</span> Calculactor
          </h1>
          <span className="z-0 rounded px-4 py-2 text-center text-accent-color lg:bg-accent-color-10">
            {greetings}
          </span>
        </div>
        <div className="Bottom flex flex-initial flex-col">
          <div className="Content flex flex-1 flex-col p-5"></div>
        </div>
      </div> */}
    </React.Fragment>
  );
}
