"use client";
import { useEffect, useRef } from "react";
import * as BABYLON from "babylonjs";
import "babylonjs-loaders";
import React from "react";
// import "babylonjs-inspector";

export default function BabylonBg(props: {
  setLoaderState: (state: boolean) => void;
}): JSX.Element {
  const { setLoaderState } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const engine = new BABYLON.Engine(canvas, true);

    //自定义加载动画
    engine.loadingScreen = {
      displayLoadingUI: (): void => {
        // console.log('display')
      },
      hideLoadingUI: (): void => {
        // console.log('hidden')
      },
      loadingUIBackgroundColor: "#000000",
      loadingUIText: "Loading...",
    };

    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

    // 是否开启inspector ///////////////////////////////////////////////////////////////////////////////////////////////////
    // Inspector.Show(scene, {
    //   // embedMode: true
    // })

    // 摄像机
    const camera = new BABYLON.ArcRotateCamera(
      "Camera",
      Math.PI / 2,
      Math.PI / 1.97,
      12.7,
      new BABYLON.Vector3(0, 3.3, 3),
      scene,
    );
    camera.attachControl(canvas, false);
    camera.minZ = 0.1;
    camera.fov = 0.26;

    const cameraControl = (event: MouseEvent): void => {
      if (event.buttons === 0) {
        camera.alpha += event.movementX / 100000;
        camera.beta += event.movementY / 100000;
      }
    };
    // 注册鼠标移动事件来触发相机控制
    canvas.addEventListener("mousemove", cameraControl);

    // 加载model
    void BABYLON.SceneLoader.AppendAsync(
      "/models/",
      "bg.glb",
      scene,
      function (event) {
        // 加载进度计算
        const percentage = event.lengthComputable
          ? " " + Math.floor((event.loaded / event.total) * 100) + "%"
          : "";
        console.log(percentage);
      },
    ).then(() => {
      setTimeout(() => setLoaderState(true), 500);
    });

    // 世界坐标轴显示
    // new AxesViewer(scene, 1)

    // 功能型信息PBR材质
    const infoPbrMaterial = new BABYLON.PBRMaterial("infoPbrMaterial", scene);
    infoPbrMaterial.albedoColor = new BABYLON.Color3(
      255 / 255,
      255 / 255,
      255 / 255,
    );
    infoPbrMaterial.metallic = 1;
    infoPbrMaterial.roughness = 0.9;
    infoPbrMaterial.emissiveColor = new BABYLON.Color3(
      255 / 255,
      255 / 255,
      255 / 255,
    );

    // 当场景中资源加载和初始化完成后
    scene.executeWhenReady(() => {
      // 注册循环渲染函数
      engine.runRenderLoop(() => {
        scene.render();
      });
    });

    //组件卸载时
    return () => {
      // 销毁场景和引擎
      scene.dispose();
      engine.dispose();
      canvas.removeEventListener("mousemove", cameraControl);
      console.log("内存已清理");
    };
  }, [setLoaderState]);

  return (
    <React.Fragment>
      <canvas
        ref={canvasRef}
        className="fixed left-0 top-0 -z-0 h-dvh w-dvw bg-transparent"
      >
        当前浏览器不支持canvas，尝试更换Google Chrome浏览器尝试
      </canvas>
    </React.Fragment>
  );
}
