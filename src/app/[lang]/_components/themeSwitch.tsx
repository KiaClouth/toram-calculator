"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

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
      <button className="SwitchTheme h-11 w-11 rounded-full border-1.5 border-brand-color-blue text-xs"></button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="SwitchTheme h-11 w-11 rounded-full border-1.5 border-brand-color-blue hover:bg-brand-color-blue text-xs"
    >
      {theme}
    </button>
  );
};

export default ThemeSwitch;
