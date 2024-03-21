import * as React from "react";
// 定义 MyButton 组件的 props 类型
interface MyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    // 如果你有额外的自定义 props，可以在这里添加
  content?: string;
  icon?: JSX.Element;
  size?: "sm" | "md" | "lg";
  level?: "primary" | "secondary";
  }

export default function Button(props: MyButtonProps) {
  const { content, icon, size, level, ...rest } = props;

  return (
    <React.Fragment>
      <button {...rest} className={`flex flex-none cursor-pointer items-center justify-center
      ${ size === "sm" ? "gap-1 rounded-sm px-2 py-1" : size === "lg" ? "gap-3 rounded-lg px-6 py-3" : "gap-2 rounded px-4 py-2"}
      ${ level === "primary" ? "bg-accent-color text-primary-color hover:bg-accent-color-80" :  "bg-transition-color-8 hover:bg-transition-color-20"} `}>
        {icon}
        {content}
      </button>
    </React.Fragment>
  );
}
