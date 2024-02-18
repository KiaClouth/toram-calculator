"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClick = () => {
    switch (theme) {
      case "dark":
        setTheme("light");
        break;
      case "light":
        setTheme("dark");
        break;
      default:
        setTheme("light");
        break;
    }
  };

  if (!mounted) {
    return (
      <button className="SwitchTheme h-11 w-11 rounded-full border-1.5 border-brand-color-1st text-xs"></button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="SwitchTheme h-11 w-11 rounded-full border-1.5 border-brand-color-1st hover:bg-brand-color-1st text-xs"
    >
      {theme}
    </button>
  );
};

export default ThemeSwitch;
