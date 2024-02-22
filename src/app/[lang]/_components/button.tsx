import * as React from "react";
// 定义 MyButton 组件的 props 类型
interface MyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    // 如果你有额外的自定义 props，可以在这里添加
  content: string;
  icon?: JSX.Element;
  }

export default function Button(props: MyButtonProps) {
  const { content, icon, ...rest } = props;

  return (
    <React.Fragment>
      <button {...rest} className="flex flex-none cursor-pointer items-center justify-center gap-2 rounded bg-transition-color-8 px-8 py-2 hover:bg-transition-color-20">
        {icon}
        {content}
      </button>
    </React.Fragment>
  );
}
