"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  // 用于pwa状态栏颜色动态切换
  const { theme } = useTheme();
  useEffect(() => {
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (theme === "dark") {
      themeColorMeta?.setAttribute("content", `#373737`);
    } else if (theme === "light") {
      themeColorMeta?.setAttribute("content", `#ffffff`);
    }
  }, [theme]);

  return (
    <motion.div
      className="Template @text-transparent flex h-dvh w-dvw flex-col-reverse lg:flex-row"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ease: "easeInOut", duration: 0.75 }}
    >
      {children}
    </motion.div>
  );
}
