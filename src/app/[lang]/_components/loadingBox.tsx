import * as React from "react";

export default function LoadingBox(props: React.HTMLProps<HTMLDivElement>) {
  return (
    <div {...props} className={`Loading relative overflow-x-hidden ${{ ...props }.className}`}>
      <div className="line z-0 h-1 w-full bg-accent-color"></div>
      <div className="break dot1 absolute top-0 z-10 h-1 w-1 bg-primary-color"></div>
      <div className="break dot2 absolute top-0 z-10 h-1 w-1 bg-primary-color"></div>
      <div className="break dot3 absolute top-0 z-10 h-1 w-1 bg-primary-color"></div>
    </div>
  );
}
