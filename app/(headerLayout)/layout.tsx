import Header from "@/components/Layout/Header";
import React, {ReactNode} from "react";

const HeaderLayout = ({children}: {children: ReactNode}) => {
  return (
    <>
      <Header />
      <main className="px-16">{children}</main>
    </>
  );
};

export default HeaderLayout;
