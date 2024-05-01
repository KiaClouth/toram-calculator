import * as React from "react";

type Size = "sm" | "md" | "lg";
type Level = "primary" | "secondary" | "tertiary";

interface MyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  icon?: JSX.Element;
  size?: Size;
  level?: Level;
  active?: boolean;
}

export default function Button(props: MyButtonProps) {
  const { children, icon, size, level, active, ...rest } = props;
  const sizeClass = {
    sm: "gap-1 rounded px-4 py-1",
    md: "gap-2 rounded px-4 py-2",
    lg: "gap-3 rounded-lg px-6 py-3",
  }[size ?? "md"];
  const levelClass = {
    primary: "border-1.5 border-transparent bg-accent-color text-primary-color hover:bg-accent-color-80",
    secondary: "border-1.5 border-accent-color-30 bg-primary-color hover:bg-accent-color hover:text-primary-color",
    tertiary: "border-1.5 border-transparent bg-transition-color-8 hover:bg-transition-color-20",
  }[level ?? "secondary"];
  const disableClass = rest.disabled ? "pointer-events-none opacity-50" : "";
  const activedClass = active && "shadow-2xl shadow-brand-color-1st outline-brand-color-1st";
  const defaultButtonClassNames = `${disableClass} cursor-pointer flex flex-none items-center justify-center underline-offset-4 hover:underline ${sizeClass} ${levelClass} ${activedClass} `;

  return (
    <React.Fragment>
      <button
        {...rest}
        className={` `+
          rest.className
            ? defaultButtonClassNames + rest.className
            : defaultButtonClassNames
        }
      >
        {icon}
        {children}
      </button>
    </React.Fragment>
  );
}
