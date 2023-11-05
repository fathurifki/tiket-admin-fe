import React from "react";
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

function Sidebar({ menuItems }) {
  return (
    <div className="lg:bg-[#f5f8fa] fixed p-4 border-r shadow-md lg:w-64 lg:h-full hidden md:block md:h-full md:w-20">
      <div>
        <div className="mb-4 p-2">
          <div className="flex gap-2 items-center">
            <Image
              width={10}
              height={10}
              src="https://s3-alpha-sig.figma.com/img/d4f5/da8d/0ce1f62fdcad1fa0ca39a16d21e57e7b?Expires=1699833600&Signature=WyRcuAAZDixG3k57Ao69DDBj1jOmPNzEEsfFPdIUeRFAcf5Z1r4fWk2kgwcLpT~0OWAPEAqpbin~1zDCfQCs-tvCc355x5U3jDOwrc~YL8JFd99u6Rc0D1OaM88j8qAFeKuP6q2MjsnQBJ9aZfU-OJNm-zpD1sooufsw~askQqHW9nU12tgWqaLiWdD6krMAIA5VasCnKyOGCQYS-yjsKMPcXHkYhrW7SjEwwEbeF-N0F8w6Wbu19m1bKIBz92PQszKKtnmDCymWCCxabXds98g7bar2qxJCsFqH8F4Ryje-9VJSIiRlwQ79uTGvEnyImOfnCoct05ywOyOVEA7Eiw__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4"
              alt="User"
              className="w-10 h-10 rounded-full bg-black p-2"
            />
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
      <div className="absolute bottom-0 flex pb-6 gap-2 lg:items-start md:items-center">
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
    { icon: <BsBook />, label: "Blog", href: "/blog" },
    { icon: <BsFileEarmarkText />, label: "Static Page", href: "/static-page" },
  ];

  return (
    <div className="relative bg-white h-full">
      <Sidebar menuItems={menuItems} />
      <div className="px-4 py-8 md:ml-24 lg:ml-72 ">{children}</div>
    </div>
  );
}
