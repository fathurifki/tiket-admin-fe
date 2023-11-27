"use client";

import React, { useState, useEffect } from "react";
import {
  BsBook,
  BsBuildingFill,
  BsCalendarFill,
  BsCardImage,
  BsCreditCardFill,
  BsFileEarmarkText,
  BsHouseFill,
  BsPeopleFill,
  BsPersonFill,
  BsTicketFill,
} from "react-icons/bs";
import Link from "next/link";
import Image from "next/image";
import { LogOutIcon } from "lucide-react";
import LoginPage from "../template/LoginPage";
import { deleteCookie, getCookie } from "cookies-next";
import { useRouter } from "next/router";
import ImageAssets from "../assets";

function Sidebar({ menuItems }) {
  const router = useRouter();

  const logoutButton = () => {
      deleteCookie("access_token");
      router.push("/login");
  }

  return (
    <div className="lg:bg-[#f5f8fa] fixed p-4 border-r shadow-md lg:w-64 lg:h-full hidden md:block md:h-full md:w-20">
      <div>
        <div className="mb-4 p-2">
          <div className="flex gap-2 items-center">
            <h1 className="font-bold mb-2 lg:block hidden">
              Mantra Botol Kreatif
            </h1>
          </div>
        </div>
        <div className="flex flex-col gap-4 p-2 h-full lg:items-start md:items-center">
          {menuItems.map((item, index) => (
            <Link href={item.href} key={index} className="mb-6 text-xl">
              <div className="flex items-center gap-6">
                <div>{item.icon}</div>
                <div className="hidden lg:block">{item.label}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div onClick={logoutButton} className="absolute bottom-0 flex pb-6 gap-2 lg:items-start md:items-center cursor-pointer">
        <LogOutIcon />
        <span className="hidden lg:block">Logout</span>
      </div>
    </div>
  );
}

export default function LayoutProfile({ children }) {
  const [isClient, setIsClient] = useState(false);
  const [isLogin, setIsLogin] = useState(null);
  const router = useRouter();
  const login = getCookie("token") && getCookie("role") === "admin";
  // const [windowWidth, setWindowWidth] = useState(null);

  useEffect(() => {
    setIsClient(true);
    setIsLogin(getCookie("token") && getCookie("role") === "admin");
    // if (typeof window !== "undefined") {
    //   setWindowWidth(window.innerWidth);
    //   window.addEventListener("resize", () =>
    //     setWindowWidth(window.innerWidth)
    //   );
    // }
    // return () => {
    //   if (typeof window !== "undefined") {
    //     window.removeEventListener("resize", () =>
    //       setWindowWidth(window.innerWidth)
    //     );
    //   }
    // };
  }, [login]);

  const menuItems = [
    { icon: <BsHouseFill />, label: "Dashboard", href: "/" },
    { icon: <BsCalendarFill />, label: "Events", href: "/events" },
    { icon: <BsPeopleFill />, label: "Users", href: "/users" },
    { icon: <BsCardImage />, label: "Banner", href: "/banner" },
    {
      icon: <BsCreditCardFill />,
      label: "Transactions",
      href: "/transactions",
    },
    { icon: <BsBook />, label: "Blog", href: "/blog" },
    { icon: <BsFileEarmarkText />, label: "Static Page", href: "/static-page" },
  ];

  // if (windowWidth < 500) {
  //   return (
  //     <div className="min-h-screen flex flex-col justify-center items-center text-2xl font-bold text-center">
  //       <p>Not support mobile, please use desktop view for better experience</p>
  //     </div>
  //   );
  // }

  return (
    <div>
      <div className="relative bg-white h-full">
        <Sidebar menuItems={menuItems} />
        <div className="px-4 py-8 md:ml-24 lg:ml-72 ">{children}</div>
      </div>
    </div>
  );
}
