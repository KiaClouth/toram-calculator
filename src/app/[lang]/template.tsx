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
      initial={{
        opacity: 0,
        // clipPath: "inset(50% 50% 50% 50% round 36px)",
      }}
      animate={{
        opacity: 1,
        // clipPath: "inset(0% 0% 0% 0% round 0px)",
      }}
      transition={{ ease: "easeInOut", duration: 1 }}
    >
      {children}
    </motion.div>
  );
}
