"use client";
import * as React from "react";

export default function Dialog(props: {
  children: React.ReactNode;
  state: boolean;
  setState: (state: boolean) => void;
}) {
  const { children, state, setState } = props;

  function handleClose(): void {
    setState(false);
  }

  return (
    <React.Fragment>
      <div
        className={`DialogBox fixed left-0 top-0 z-50 flex h-dvh w-dvw flex-col bg-transition-color-20 backdrop-blur ${state ? " visible opacity-100" : " invisible opacity-0"}`}
      >
        <div className="DialogCloseBtn flex-1 cursor-pointer hover:bg-transition-color-20" onClick={handleClose}></div>
        <div className="DialogContent flex items-center flex-none max-h-[80dvh] min-h-[40dvh] flex-col bg-primary-color-90 overflow-y-auto ">
          {children}
        </div>
        <div className="DialogCloseBtn flex-1 cursor-pointer hover:bg-transition-color-20" onClick={handleClose}></div>
      </div>
    </React.Fragment>
  );
}