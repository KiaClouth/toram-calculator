import * as React from "react";
// 定义 MyButton 组件的 props 类型
interface MyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // 如果你有额外的自定义 props，可以在这里添加
  children?: React.ReactNode;
  icon?: JSX.Element;
  size?: "sm" | "md" | "lg";
  level?: "primary" | "secondary" | "tertiary";
}

export default function Button(props: MyButtonProps) {
  const { children, icon, size, level, ...rest } = props;
  const defaultButtonClassNames = ` flex flex-none cursor-pointer items-center justify-center
  ${size === "sm"
    ? "gap-1 rounded px-4 py-1"
    : size === "lg"
      ? "gap-3 rounded-lg px-6 py-3"
      : "gap-2 rounded px-4 py-2"}
  ${
    level === "primary"
      ? "border-1.5 border-transparent bg-accent-color text-primary-color hover:bg-accent-color-80"
      : level === "tertiary"
        ? "border-1.5 border-transparent bg-transition-color-8 hover:bg-transition-color-20"
        : "border-1.5 border-accent-color-30 bg-primary-color hover:bg-accent-color hover:text-primary-color"
  } `;

  return (
    <React.Fragment>
      <button
        {...rest}
        className={
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
