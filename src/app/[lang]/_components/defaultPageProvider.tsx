import React from "react";

export default function DefaultPageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-1 overflow-y-auto">
      <div className="Module1 basis-[160px] flex-none flex-col bg-accent-color-10 "></div>
      <div className="Module2 flex flex-1">
        <div className="LeftArea flex-1"></div>
        <div className="ModuleContent flex basis-full flex-col-reverse lg:flex-col 2xl:basis-[1536px]">
          {children}
        </div>
        <div className="RightArea flex-1"></div>
      </div>
    </main>
  );
}
