import React from "react";

export default function DefaultPageProvider({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-1 overflow-y-auto">
    {/* <div className="Module1 hidden max-w-60 flex-shrink flex-col bg-bg-grey-20 "></div> */}
    <div className="Module2 flex flex-1">
      <div className="LeftArea flex-1"></div>
      <div className="ModuleContent flex max-w-[100dvw] flex-1 basis-full flex-col-reverse lg:flex-col 2xl:max-w-[1536px] 2xl:basis-[1536px]">
        {children}
      </div>
      <div className="RightArea flex-1"></div>
    </div>
  </main>
  );
}
