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
  const [windowWidth, setWindowWidth] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);
      window.addEventListener("resize", () =>
        setWindowWidth(window.innerWidth)
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", () =>
          setWindowWidth(window.innerWidth)
        );
      }
    };
  }, []);

  useEffect(() => {
    const token = getCookie("token");
    if (!token && router.pathname !== "/login") {
      router.push("/login");
    }
  }, []);

  return (
    <>
      {windowWidth > 500 ? (
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
      ) : (
        <div className="min-h-screen flex flex-col justify-center items-center text-2xl font-bold text-center">
          <p>
            Not support mobile, please use desktop view for better experience
          </p>
        </div>
      )}
    </>
  );
}

export default MyApp;
