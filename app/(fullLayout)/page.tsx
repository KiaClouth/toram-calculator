"use client";
import React from "react";
import {useTheme} from "next-themes";
import {useAppSelector, useAppDispatch} from "@/store/hooks";
import {setGlobalData} from "@/store/modules/common";
import {useRouter} from "next-nprogress-bar";
import Link from "next/link";
const Home = () => {
  const {systemTheme, theme, setTheme} = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const dispatch = useAppDispatch();
  const globalData = useAppSelector((state) => state.common.globalData);
  const router = useRouter();
  const fetchData = async () => {
    try {
      const response = await fetch("/api/banner", {
        method: "GET",
        headers: {
          Authorization: "000000",
          "Content-Type": "application/json", // 设置请求体的类型为 JSON
          requestUrl: "/test",
          authType: "default",
        },
      });
      // const response = await fetch("/api/user", {
      //   method: "POST",
      //   headers: {
      //     "Authorization": "000000",
      //     "Content-Type": "application/json", // 设置请求体的类型为 JSON
      //     "requestUrl": "/test",
      //     "authType": "default",
      //   },
      //   body: JSON.stringify({
      //     contentType: "application/json"
      //     /* your request data here */
      //   })
      // });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
      } else {
        console.error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  return (
    <div>
      {currentTheme === "dark" ? (
        <div
          className="cursor-pointer text-yellow-400"
          onClick={() => {
            setTheme("light");
          }}
        >
          set light
        </div>
      ) : (
        <div
          className="cursor-pointer text-slate-700"
          onClick={() => {
            setTheme("dark");
          }}
        >
          set dark
        </div>
      )}
      <div onClick={fetchData}>打印数据</div>
      <div className="bg-globalBg">globalBg</div>
      <div className="bg-globalBgInvert text-globalBgInvert">globalBgInvert</div>
      <div className="border-badgesPurpleBorder border">badgesPurpleBorder</div>
      <div
        onClick={() => {
          dispatch(setGlobalData({role: "admin"}));
        }}
      >
        click change role: {globalData.role}
      </div>
      <Link href={"./pet"}>pet</Link>
      <div
        onClick={() => {
          router.push("/userCenter");
        }}
      >
        click to user center
      </div>
    </div>
  );
};
export default Home;
