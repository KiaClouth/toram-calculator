import React from "react";
import { Keyframes } from "./keyframes";

export default function RandomBallBackground() {
  
  const balls: JSX.Element[] = [];
  // 背景随机动画
  const numBalls = 10;

  for (let i = 0; i < numBalls; i++) {
    const keyFramesName = "randomMove" + i;
    const ball = (
      <React.Fragment>
        <Keyframes
          name={keyFramesName}
          from={{ transform: "translate(0, 0)" }}
          to={{ transform: `translate(${Math.random() * (i % 2 === 0 ? -11 : 11)}rem, ${Math.random() * (i % 2 === 0 ? -11 : 11)}rem)` }}
        />
        <div
          className={`Bll absolute aspect-square rounded-full`}
          style={{
            backgroundColor: `rgb(var(--brand-${i % 3 === 0 ? "3rd" : i % 3 === 1 ? "2nd" : "1st"}))`,
            width: `${Math.random() * 10}vw`,
            top: `${Math.random() * 100}vh`,
            left: `${Math.random() * 100}vw`,
            transform: `scale(${Math.random()})`,
            animationName: keyFramesName,
            animationDuration: `${(Math.random() + 1) * 10000}ms`,
            animationDirection: "alternate",
            animationFillMode: "both",
            animationIterationCount: "infinite",
            animationTimingFunction: "ease-in-out",
          }}
        ></div>
      </React.Fragment>
    );

    balls.push(ball);
  }
  
  return (
    <div className="Background -z-10 w-dvw h-dvh fixed">{balls}</div>
  );
}
