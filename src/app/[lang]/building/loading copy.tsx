import React from "react";
import LoadingBox from "../_components/loadingBox";
import Link from "next/link";

export default function Loading() {
  return (
    <Link href={"/"}>
    <div className="LoadingPage bg-aeskl fixed flex justify-center items-center left-0 top-0 z-50 h-dvh w-dvw bg-cover bg-center">
      <div className="LoadingMask fixed to-primary-color-0 h-dvh w-dvw bg-gradient-to-t from-primary-color from-5% to-20%"></div>
      <div className="LoadingState fixed top-[2%] left-[4dvw] lg:left-[10dvw] flex flex-col gap-3">
        <h1 className="animate-pulse">施工中...</h1>
        <LoadingBox className="w-[92dvw] lg:w-[80dvw]" />
      </div>
    </div>
    </Link>
  );
}
