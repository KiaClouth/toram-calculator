"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

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

  return (
    <button
      onClick={handleClick}
      className="SwitchTheme hidden h-11 w-11 rounded-full border-1.5 border-brand-color-blue text-xs"
    >
      {theme}
    </button>
  );
};

export default ThemeSwitch;
