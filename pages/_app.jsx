import RootLayout from "../app/layout";
import { Inter, Mulish, Comic_Neue } from "next/font/google";
import { ToastProvider } from "@/components/ui/toast";
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import { Toaster } from "@/components/ui/toaster";

const mulish = Mulish({
  weight: ["400", "700"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

const comicNeue = Comic_Neue({
  weight: ["400", "700"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

function MyApp({ Component, pageProps, router }) {
  const isLoginPage = router.pathname === "/login";

  return (
    <>
      <div className="lg:hidden md:hidden xl:hidden block min-h-screen flex flex-col justify-center items-center text-2xl font-bold text-center">
        <p>Not support mobile, please use desktop view for better experience</p>
      </div>
      <div className="hidden md:block">
        <ToastProvider>
          {isLoginPage ? (
            <Component {...pageProps} />
          ) : (
            <RootLayout>
              <Component {...pageProps} />
            </RootLayout>
          )}
          <Toaster />
        </ToastProvider>
      </div>
    </>
  );
}

export default MyApp;
