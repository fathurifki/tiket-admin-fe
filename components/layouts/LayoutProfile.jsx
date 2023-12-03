"use client";

import React from "react";
import {
  BsBook,
  BsCalendarFill,
  BsCardImage,
  BsCreditCardFill,
  BsFileEarmarkText,
  BsGlobe,
  BsHouseFill,
  BsPeopleFill,
} from "react-icons/bs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { LogOutIcon } from "lucide-react";
import { deleteCookie,} from "cookies-next";
import { useRouter } from "next/router";

function Sidebar({ menuItems }) {
  const router = useRouter();

  const logoutButton = () => {
    deleteCookie("access_token");
    router.push("/login");
  };

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
        <div className="flex flex-col gap-8 p-2 h-full lg:items-start md:items-center">
          {menuItems.map((item, index) => (
            <>
              {item.children ? (
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-xl">
                      <div className="flex items-center gap-6">
                        <div>{item.icon}</div>
                        <div className="hidden lg:block">{item.label}</div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      {item.children.map((v, childIndex) => (
                        <Link
                          href={v.href}
                          key={childIndex}
                          className="text-xl"
                        >
                          <div className="flex items-center gap-6 py-2">
                            <div>{v.icon}</div>
                            <div className="hidden lg:block">{v.label}</div>
                          </div>
                        </Link>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ) : (
                <Link href={item.href} key={index} className="text-xl">
                  <div className="flex items-center gap-6">
                    <div>{item.icon}</div>
                    <div className="hidden lg:block">{item.label}</div>
                  </div>
                </Link>
              )}
            </>
          ))}
        </div>
      </div>
      <div
        onClick={logoutButton}
        className="absolute bottom-0 flex pb-6 gap-2 lg:items-start md:items-center cursor-pointer"
      >
        <LogOutIcon />
        <span className="hidden lg:block">Logout</span>
      </div>
    </div>
  );
}

export default function LayoutProfile({ children }) {
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
    {
      icon: <BsBook />,
      label: "Blog",
      href: "",
      children: [
        { icon: <BsBook />, label: "List", href: "/blog" },
        { icon: <BsGlobe />, label: "Category", href: "/blog-category" },
      ],
    },
    { icon: <BsFileEarmarkText />, label: "Static Page", href: "/static-page" },
  ];

  return (
    <div>
      <div className="relative bg-white h-full">
        <Sidebar menuItems={menuItems} />
        <div className="px-4 py-8 md:ml-24 lg:ml-72 ">{children}</div>
      </div>
    </div>
  );
}
