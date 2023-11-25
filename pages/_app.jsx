import RootLayout from "../app/layout";
import { Inter, Mulish, Comic_Neue } from "next/font/google";
import { ToastProvider } from "@/components/ui/toast";
import { useEffect } from "react";
import { getCookie } from "cookies-next";

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

  useEffect(() => {
    // Get the token from the cookies
    const token = getCookie("token");

    // If the token doesn't exist, redirect to the login page
    if (!token && router.pathname !== "/login") {
      router.push("/login");
    }
  }, []);

  return (
    <ToastProvider>
      {isLoginPage ? (
        <Component {...pageProps} />
      ) : (
        <RootLayout>
          <Component {...pageProps} />
        </RootLayout>
      )}
    </ToastProvider>
  );
}

export default MyApp;
