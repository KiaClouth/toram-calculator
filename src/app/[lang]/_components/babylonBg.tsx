"use client";
import { useEffect, useRef, useState } from "react";
import * as BABYLON from "babylonjs";
import "babylonjs-loaders";
import React from "react";
import Image from "next/image";
import LoadingBox from "./loadingBox";

export default function BabylonBg(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loaderState, setLoaderState] = useState(false);
  const [docSize, setDocSize] = useState({
    w: 0,
    h:0
  })

  useEffect(() => {
    setDocSize({
      w: document.body.clientWidth,
      h: document.body.clientHeight
    })
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

    const mainColor = new BABYLON.Color3(
      234 / 255,
      249 / 255,
      254 / 255,
    ).toLinearSpace();
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 1);
    scene.ambientColor = mainColor;
    // scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
    // scene.fogDensity = 0.01;
    // scene.fogColor = mainColor;

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
      1.58,
      1.6,
      3.12,
      new BABYLON.Vector3(0, 0.43, 0),
      scene,
    );
    camera.attachControl(canvas, false);
    camera.minZ = 0.1;
    camera.fov = 1;
    camera.wheelDeltaPercentage = 0.05;
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
    new BABYLON.LensRenderingPipeline(
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
    // y旋转动画
    const yRot = new BABYLON.Animation(
      "yRot",
      "rotation.y",
      1,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE,
    );
    yRot.setKeys([
      // 由于是匀速旋转动画，只有起始帧和终点帧
      {
        frame: 0,
        value: 0,
      },
      {
        frame: 96,
        value: 2 * Math.PI,
      },
    ]);

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
    stagePbrMaterial.albedoColor = mainColor;
    stagePbrMaterial.ambientColor = new BABYLON.Color3(0.008, 0.01, 0.01);

    // -------------------------光照设置-------------------------
    // 设置顶部锥形光
    const mainSpotLight = new BABYLON.SpotLight(
      "mainSpotLight",
      new BABYLON.Vector3(0, 30, 0),
      new BABYLON.Vector3(0, -1, 0),
      Math.PI / 3,
      2,
      scene,
    );
    mainSpotLight.id = "mainSpotLight";
    mainSpotLight.intensity = 250;
    mainSpotLight.radius = 10;

    // 设置椭圆形舞台锥形光
    const stageSpotLight = new BABYLON.SpotLight(
      "stageSpotLight",
      new BABYLON.Vector3(0, 4.5, 2.5),
      new BABYLON.Vector3(0, -1, 0),
      Math.PI / 4,
      2,
      scene,
    );
    stageSpotLight.id = "stageSpotLight";
    stageSpotLight.intensity = 40;
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
      "bg1.glb",
      scene,
      function (event) {
        // 加载进度计算
        const percentage = event.lengthComputable
          ? " " + Math.floor((event.loaded / event.total) * 100) + "%"
          : "";
      },
    ).then(() => {
      // 材质添加
      scene.meshes.forEach((mesh) => {
        mesh.material = stagePbrMaterial;
        mesh.receiveShadows = true;
        generator.addShadowCaster(mesh, true);
      });
    });

    // 两侧柱状粒子系统
    const spsPositionL = { x: -7, y: 3, z: -6 }; // 左侧粒子柱中心坐标
    const spsPositionR = { x: 7, y: 3, z: -6 }; // 右侧粒子柱中心坐标
    const spsSizeXZ = 2; // 粒子柱宽度和厚度
    const spsSizeY = 10; // 粒子柱高度
    const spsNumber = 1000; // 粒子数

    const SPS = new BABYLON.SolidParticleSystem("SPS", scene);
    const tetra = BABYLON.MeshBuilder.CreateBox("tetra", {});
    SPS.addShape(tetra, spsNumber);
    tetra.dispose();
    const spsMesh = SPS.buildMesh();
    spsMesh.rotation = new BABYLON.Vector3(Math.PI * -1 / 12,0,0)
    spsMesh.material = stagePbrMaterial;
    generator.addShadowCaster(spsMesh, true);
    const particlePosY: number[] = [];

    SPS.initParticles = () => {
      for (let p = 0; p < SPS.nbParticles; p++) {
        const particle = SPS.particles[p]!;
        const currY = BABYLON.Scalar.RandomRange(0, spsPositionL.y + spsSizeY);
        particlePosY.push(currY);
        if (p % 2 === 0) {
          particle.position.x = BABYLON.Scalar.RandomRange(
            spsPositionL.x - spsSizeXZ,
            spsPositionL.x + spsSizeXZ,
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
          particle.position.z = BABYLON.Scalar.RandomRange(
            spsPositionR.z - spsSizeXZ,
            spsPositionR.z + spsSizeXZ,
          );
        }
        particle.position.y = currY - 0.35;

        const scale = BABYLON.Scalar.RandomRange(0.1, 0.2);
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
    SPS.updateParticle = (particle) => {
      if (particle.position.y >= spsSizeY) {
        particle.position.y = - Math.random() * spsSizeY * 1 / 2;
      } else {
        particle.position.y +=
          (0.04 * particlePosY[particle.idx]!) / engine.getFps();
        particle.rotation.y +=
          (0.1 * particlePosY[particle.idx]!) / engine.getFps();
      }
      return particle;
    };

    scene.registerAfterRender(() => {
      SPS.setParticles();
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
        <Image // 此组件只用作判断图片是否缓存完毕，不展示
          src={"/app-image/bg.jpg"}
          alt="背景图片"
          width={docSize.w}
          height={docSize.h}
          className={`invisible fixed left-0 top-0 z-10 h-dvh w-dvw opacity-0`}
          onLoad={() => {
            localStorage.setItem("isImageCached", "true");
          }}
        />
        <div className="LoadingMask fixed left-0 top-0 h-full w-full bg-gradient-to-b from-primary-color from-10% to-primary-color-0 to-25% lg:bg-gradient-to-t lg:from-5% lg:to-[25%]"></div>
        <div className="LoadingState fixed left-[4dvw] top-[2%] flex flex-col gap-3 lg:left-[10dvw] lg:top-[97%] lg:-translate-y-full">
          <h1 className="animate-pulse">加载中...</h1>
          <LoadingBox className="w-[92dvw] lg:w-[80dvw]" />
        </div>
      </div>
    </React.Fragment>
  );
}
