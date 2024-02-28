"use client";
import React, { useState } from "react";
import BabylonBg from "./_components/babylonBg";
import LoadingBox from "./_components/loadingBox";

export default function IndexPageClient(props: { greetings: string }) {
  const { greetings } = props;
  const [loaderState, setLoaderState] = useState(false);
  return (
    <React.Fragment>
      <BabylonBg setLoaderState={setLoaderState} />
      {/* <ImageBackground /> */}
      <div className="jumbo fixed left-0 top-0 -z-0 h-dvh w-dvw opacity-50"></div>
      <div className="Top flex flex-1 flex-col items-center justify-center">
        <h1 className="Title mx-8 -translate-y-1/4 border-b-2 p-10 text-center text-5xl font-extrabold tracking-tight lg:text-9xl">
          Toram <span className=" text-brand-color-1st">の</span> Calculactor
        </h1>
        <span className=" rounded px-4 py-2 text-center text-accent-color lg:bg-accent-color-10">
          {greetings}
        </span>
      </div>
      <div className="Bottom flex flex-initial flex-col">
        <div className="Content flex flex-1 flex-col p-5"></div>
      </div>
      <div
        className={`LoadingPage fixed left-0 top-0 z-20 flex h-dvh w-dvw items-center justify-center bg-aeskl bg-cover bg-center ${
          !loaderState
            ? "pointer-events-auto visible opacity-100"
            : "pointer-events-none invisible opacity-0"
        }`}
      >
        <div className="LoadingMask fixed left-0 top-0 h-full w-full bg-gradient-to-b from-primary-color from-10% to-primary-color-0 to-25% lg:bg-gradient-to-t lg:from-5% lg:to-[25%]"></div>
        <div className="LoadingState fixed left-[4dvw] top-[2%] flex flex-col gap-3 lg:left-[10dvw] lg:top-[97%] lg:-translate-y-full">
          <h1 className="animate-pulse">加载中...</h1>
          <LoadingBox className="w-[92dvw] lg:w-[80dvw]" />
        </div>
      </div>
    </React.Fragment>
  );
}
