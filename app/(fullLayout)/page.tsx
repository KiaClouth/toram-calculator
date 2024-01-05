"use client";
import React from "react";
import { useTheme } from "next-themes";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setGlobalData } from "@/store/modules/common";
import { useRouter } from "next-nprogress-bar";
import Link from "next/link";
const Home = () => {
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const dispatch = useAppDispatch();
  const globalData = useAppSelector((state) => state.common.globalData);
  const router = useRouter();
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
      <div className="bg-globalBg">globalBg</div>
      <div className="bg-globalBgInvert text-globalBgInvert">globalBgInvert</div>
      <div className="border-badgesPurpleBorder border">badgesPurpleBorder</div>
      <div
        onClick={() => {
          dispatch(setGlobalData({ role: "admin" }));
        }}
      >
        click change role: {globalData.role}
      </div>
      <Link href={'./pet'}>
        pet
      </Link>
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
