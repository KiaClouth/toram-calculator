"use client";
import {ReactNode} from "react";
// store
import {Provider} from "react-redux";
import {store} from "@/store/store";
import {ThemeProvider} from "next-themes";
// progress
import {AppProgressBar as ProgressBar} from "next-nprogress-bar";

const Providers = ({children}: {children: ReactNode}) => {
  return (
    <Provider store={store}>
      <ThemeProvider enableSystem={true} attribute="class">
        {children}
        <ProgressBar height="2px" color="#4F46E5" options={{showSpinner: false}} />
      </ThemeProvider>
    </Provider>
  );
};
export default Providers;
