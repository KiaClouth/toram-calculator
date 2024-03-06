import * as React from "react";

export default function LoadingBox(props: React.HTMLProps<HTMLDivElement>) {
  return (
    <div {...props} className={`Loading relative overflow-x-hidden ${{ ...props }.className}`}>
      <div className="line z-0 h-0.5 w-full bg-accent-color rounded-full"></div>
      <div className="break dot1 absolute top-0 z-10 h-0.5 w-1 bg-primary-color"></div>
      <div className="break dot2 absolute top-0 z-10 h-0.5 w-1 bg-primary-color"></div>
      <div className="break dot3 absolute top-0 z-10 h-0.5 w-1 bg-primary-color"></div>
    </div>
  );
}
