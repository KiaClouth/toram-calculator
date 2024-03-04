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

    function testModelOpen() {
      // 是否开启inspector ///////////////////////////////////////////////////////////////////////////////////////////////////
      void scene.debugLayer.show({
        // embedMode: true
      });
      // 世界坐标轴显示
      new BABYLON.AxesViewer(scene, 0.1);
    }
    testModelOpen();

    // 摄像机
    const camera = new BABYLON.ArcRotateCamera(
      "Camera",
      1.57,
      1.3,
      0.38,
      new BABYLON.Vector3(0, 0, 0),
      scene,
    );
    camera.attachControl(canvas, false);
    camera.minZ = 0.1;
    camera.fov = 1;

    const lensEffect = new BABYLON.LensRenderingPipeline(
      "lens",
      {
        edge_blur: 1.0,
        chromatic_aberration: 1.0,
        distortion: 1.0,
        dof_focus_distance: 50,
        dof_aperture: 0.05,
        grain_amount: 1.0,
        dof_pentagon: true,
        dof_gain: 1.0,
        dof_threshold: 1.0,
        dof_darken: 0.125,
      },
      scene,
      1.0,
      [camera],
    );

    const cameraControl = (event: MouseEvent): void => {
      if (event.buttons === 0) {
        camera.alpha -= event.movementX / 100000;
        camera.beta -= event.movementY / 100000;
      }
    };
    // 注册鼠标移动事件来触发相机控制
    canvas.addEventListener("mousemove", cameraControl);

    // 功能型信息PBR材质
    const stagePbrMaterial = new BABYLON.PBRMaterial("stagePbrMaterial", scene);
    stagePbrMaterial.backFaceCulling = false;
    stagePbrMaterial.albedoColor = new BABYLON.Color3(
      255 / 255,
      255 / 255,
      255 / 255,
    );
    stagePbrMaterial.metallic = 1;
    stagePbrMaterial.roughness = 0.9;
    stagePbrMaterial.emissiveColor = new BABYLON.Color3(
      255 / 255,
      255 / 255,
      255 / 255,
    );

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
      // 调整模型位置
      const mainMesh = scene.getMeshById("Cube");
      if (mainMesh) {
        mainMesh.position = new BABYLON.Vector3(-0.3, -0.58, 0);
        mainMesh.material = stagePbrMaterial;
      }
      // -------------------------光照设置-------------------------
      // 设置顶部锥形光
      const mainSpotLight = new BABYLON.SpotLight(
        "mainSpotLight",
        new BABYLON.Vector3(1, 2, 4.5),
        new BABYLON.Vector3(-0.19, -0.38, -1),
        Math.PI * (1 / 3),
        2,
        scene,
      );
      mainSpotLight.id = "mainSpotLight";
      mainSpotLight.intensity = 40;
      mainSpotLight.radius = 10;
      mainSpotLight.angle = 0.2;

      // 设置舞台锥形光
      const stageSpotLight = new BABYLON.SpotLight(
        "stageSpotLight",
        new BABYLON.Vector3(0.83, 2, 4.5),
        new BABYLON.Vector3(-0.19, -0.38, -1),
        Math.PI * (1 / 3),
        2,
        scene,
      );
      stageSpotLight.id = "stageSpotLight";
      stageSpotLight.intensity = 40;
      stageSpotLight.radius = 10;
      stageSpotLight.angle = 0.2;

      // 锥形光的阴影发生器---------------------
      const generator = new BABYLON.ShadowGenerator(1024, stageSpotLight);
      generator.usePoissonSampling = true;
      generator.bias = 0.000001;
      generator.blurScale = 1;
      generator.transparencyShadow = true;
      generator.darkness = 0;
    });

    // 当场景中资源加载和初始化完成后
    scene.executeWhenReady(() => {
      // 注册循环渲染函数
      engine.runRenderLoop(() => {
        scene.render();
      });
      // 通知loading组件
      setLoaderState(true);
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
