"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

export default function IndexPageClient(props: { greetings: string }) {
  const { greetings } = props;
  const [isImageCached,setImageCached] = useState('false')
  
  useEffect(() => {
    const bgImageCachedStatus = localStorage.getItem('isImageCached');
    bgImageCachedStatus && setImageCached(bgImageCachedStatus)
  },[])

  const imageRender = () => {
    if (isImageCached !== 'true') {
      return;
    } else {
      return (
        <Image // 配合loading页面实现在loading图片加载完成前不展示页面内容，防止闪烁
          src={"/app-image/bg.jpg"}
          alt="背景图片"
          width={0}
          height={0}
          className={`fixed left-0 top-0 z-10 h-dvh w-dvw invisible opacity-0`}
          onLoad={() => {
            localStorage.setItem('isImageCached', 'true');
          }}
        />
      );
    }
  };

  return (
    <React.Fragment>
      {imageRender()}
      <div
        className={`flex flex-1 flex-col ${
          isImageCached === 'true'
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
      </div>
    </React.Fragment>
  );
}
