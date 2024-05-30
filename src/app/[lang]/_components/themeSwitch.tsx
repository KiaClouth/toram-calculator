"use client";
import { useState, useEffect, useCallback } from "react";
import { useTheme } from "next-themes";

const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [themeColorMeta, setThemeColorMeta] = useState<Element | null>(null);

  // 用于pwa状态栏颜色动态切换
  const setThemeColorMetaAttr = useCallback(
    (themeString: typeof theme) => {
      if (themeString === "dark") {
        themeColorMeta?.setAttribute("content", `#ffffff`);
      } else if (themeString === "light") {
        themeColorMeta?.setAttribute("content", `#373737`);
      }
    },
    [themeColorMeta],
  );

  useEffect(() => {
    setThemeColorMeta(document.querySelector('meta[name="theme-color"]'));
    setMounted(true);
  }, [ theme]);

  const handleClick = () => {
    setThemeColorMetaAttr(theme);
    switch (theme) {
      case "dark":
        {
          setTheme("light");
        }
        break;
      case "light":
        {
          setTheme("dark");
        }
        break;
      default:
        {
          setTheme("light");
        }
        break;
    }
  };

  if (!mounted) {
    return <button className="SwitchTheme h-11 w-11 rounded-full border-1.5 border-brand-color-1st text-xs"></button>;
  }

  return (
    <button
      onClick={handleClick}
      className="SwitchTheme h-11 w-11 rounded-full border-1.5 border-brand-color-1st text-xs hover:bg-brand-color-1st"
    >
      {theme}
    </button>
  );
};

export default ThemeSwitch;
