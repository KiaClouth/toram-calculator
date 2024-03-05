"use client";
import { useEffect, useRef, useState } from "react";
import * as BABYLON from "babylonjs";
import "babylonjs-loaders";
import React from "react";
import LoadingBox from "./loadingBox";
// import "babylonjs-inspector";

export default function BabylonBg(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loaderState, setLoaderState] = useState(false);

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
    // testModelOpen();

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
    camera.wheelDeltaPercentage = 0.05
    camera.inputs.clear();
    const cameraControl = (event: MouseEvent): void => {
      if (event.buttons === 0) {
        camera.alpha -= event.movementX / 100000;
        camera.beta -= event.movementY / 100000;
      }
    };
    // 注册鼠标移动事件来触发相机控制
    canvas.addEventListener("mousemove", cameraControl);

    // 后期处理
    const lensEffect = new BABYLON.LensRenderingPipeline(
      "lens",
      {
        edge_blur: 1.0,
        chromatic_aberration: 1.0,
        distortion: 0.2,
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

    // ----------------------------------------预设内容-----------------------------------
    // 旋转动画
    const frameRate = 10;
    const yRot = new BABYLON.Animation(
      "yRot",
      "rotation.y",
      frameRate,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE,
    );

    const keyFramesR = [];

    keyFramesR.push({
      frame: 0,
      value: 0,
    });

    keyFramesR.push({
      frame: 48 * frameRate,
      value: Math.PI,
    });

    keyFramesR.push({
      frame: 96 * frameRate,
      value: 2 * Math.PI,
    });

    yRot.setKeys(keyFramesR);

    // 房间PBR材质
    const stagePbrMaterial = new BABYLON.PBRMaterial("stagePbrMaterial", scene);
    const stageTexture = new BABYLON.MirrorTexture(
      "stageTexture",
      512,
      scene,
      true,
    );
    stageTexture.mirrorPlane = BABYLON.Plane.FromPositionAndNormal(
      BABYLON.Vector3.Zero(),
      BABYLON.Vector3.Forward(),
    );
    stageTexture.lodGenerationOffset = 0;
    stageTexture.lodGenerationScale = 0.8;

    stagePbrMaterial.reflectionTexture = stageTexture;
    stagePbrMaterial.metallic = 0.5;
    stagePbrMaterial.roughness = 0.5;
    stagePbrMaterial.albedoColor = new BABYLON.Color3(
      234 / 255,
      249 / 255,
      254 / 255,
    ).toLinearSpace();

    // -------------------------光照设置-------------------------
    // 设置顶部锥形光
    const mainSpotLight = new BABYLON.SpotLight(
      "mainSpotLight",
      new BABYLON.Vector3(-0.7, 1.8, 2.2),
      new BABYLON.Vector3(0.4, -1, -2),
      Math.PI / 9,
      2,
      scene,
    );
    mainSpotLight.id = "mainSpotLight";
    mainSpotLight.intensity = 40;
    mainSpotLight.radius = 10;

    // 设置椭圆形舞台锥形光
    const stageSpotLight = new BABYLON.SpotLight(
      "stageSpotLight",
      new BABYLON.Vector3(0, 2, 0),
      new BABYLON.Vector3(0, -1, 0),
      Math.PI / 4,
      2,
      scene,
    );
    stageSpotLight.id = "stageSpotLight";
    stageSpotLight.intensity = 20;
    stageSpotLight.radius = 10;

    // 锥形光的阴影发生器---------------------
    const generator = new BABYLON.ShadowGenerator(1024, stageSpotLight);
    generator.usePoissonSampling = true;
    generator.bias = 0.000001;
    generator.blurScale = 1;
    generator.transparencyShadow = true;
    generator.darkness = 0;

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
      },
    ).then(() => {
      // 调整模型位置
      const mainMesh = scene.getMeshById("Cube");
      if (mainMesh) {
        mainMesh.position = new BABYLON.Vector3(-0.3, -0.58, 0);
        mainMesh.material = stagePbrMaterial;
        mainMesh.receiveShadows = true;
        generator.addShadowCaster(mainMesh, true);
      }
    });

    // 中央四边形
    const testBox = BABYLON.MeshBuilder.CreatePolyhedron("tetra", {
      sizeX: 0.1,
      sizeY: 0.1,
      sizeZ: 0.1,
    });
    testBox.position = new BABYLON.Vector3(0, 0, -0.3);
    testBox.material = stagePbrMaterial;
    generator.addShadowCaster(testBox, true);

    // 两侧柱状粒子系统
    const spsPositionL = { x: -0.8, y: 0, z: -0.5 }; // 左侧粒子柱中心坐标
    const spsPositionR = { x: 0.8, y: 0, z: -0.5 }; // 右侧粒子柱中心坐标
    const spsSizeXZ = 0.25; // 粒子柱宽度和厚度
    const SPS = new BABYLON.SolidParticleSystem("SPS", scene);
    const tetra = BABYLON.MeshBuilder.CreateBox("tetra", {});
    SPS.addShape(tetra, 1500);
    tetra.dispose();
    const spsMesh = SPS.buildMesh();
    spsMesh.material = stagePbrMaterial;
    generator.addShadowCaster(spsMesh, true);

    SPS.initParticles = () => {
      for (let p = 0; p < SPS.nbParticles; p++) {
        const particle = SPS.particles[p]!;
        if (p % 2 === 0) {
          particle.position.x = BABYLON.Scalar.RandomRange(
            spsPositionL.x - spsSizeXZ,
            spsPositionL.x + spsSizeXZ,
          );
          particle.position.y = BABYLON.Scalar.RandomRange(
            spsPositionL.y - 1,
            spsPositionL.y + 1,
          );
          particle.position.z = BABYLON.Scalar.RandomRange(
            spsPositionL.z - spsSizeXZ,
            spsPositionL.z + spsSizeXZ,
          );
        } else {
          particle.position.x = BABYLON.Scalar.RandomRange(
            spsPositionR.x - spsSizeXZ,
            spsPositionR.x + spsSizeXZ,
          );
          particle.position.y = BABYLON.Scalar.RandomRange(
            spsPositionR.y - 1,
            spsPositionR.y + 1,
          );
          particle.position.z = BABYLON.Scalar.RandomRange(
            spsPositionR.z - spsSizeXZ,
            spsPositionR.z + spsSizeXZ,
          );
        }

        const scale = BABYLON.Scalar.RandomRange(0.0075, 0.02);
        particle.scale.x = scale;
        particle.scale.y = scale;
        particle.scale.z = scale;

        particle.rotation.x = BABYLON.Scalar.RandomRange(0, Math.PI);
        particle.rotation.y = BABYLON.Scalar.RandomRange(0, Math.PI);
        particle.rotation.z = BABYLON.Scalar.RandomRange(0, Math.PI);
      }
    };

    SPS.initParticles(); //call the initialising function
    SPS.setParticles(); //apply the properties and display the mesh

    // 当场景中资源加载和初始化完成后
    scene.executeWhenReady(() => {
      scene.beginDirectAnimation(testBox, [yRot], 0, 96 * frameRate, true);
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
  }, []);

  return (
    <React.Fragment>
      {/* <div className=" fixed left-0 top-0 -z-0 h-dvh w-dvw bg-test bg-cover opacity-20"></div> */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none invisible fixed left-0 top-0 -z-0 h-dvh w-dvw bg-transparent opacity-0 dark:pointer-events-auto dark:visible dark:opacity-100"
      >
        当前浏览器不支持canvas，尝试更换Google Chrome浏览器尝试
      </canvas>
      <div
        className={`LoadingPage fixed left-0 top-0 z-20 flex h-dvh w-dvw items-center justify-center bg-aeskl bg-cover bg-center ${
          !loaderState
            ? "pointer-events-auto visible opacity-100"
            : "pointer-events-none invisible opacity-0"
        }`}
      >
        <div className="LoadingMask fixed left-0 top-0 h-full w-full bg-gradient-to-b from-primary-color from-10% to-primary-color-0 to-25% lg:bg-gradient-to-t lg:from-5% lg:to-[25%]"></div>
        <div className="LoadingState fixed left-[4dvw] top-[2%] flex flex-col gap-3 lg:left-[10dvw] lg:top-[97%] lg:-translate-y-full">
          <h1 className="animate-pulse">加载中...</h1>
          <LoadingBox className="w-[92dvw] lg:w-[80dvw]" />
        </div>
      </div>
    </React.Fragment>
  );
}
