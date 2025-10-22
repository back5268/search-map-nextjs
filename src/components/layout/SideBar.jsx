import { Logo } from "@/components/base";
import { Buttonz } from "@/components/core";
import { useEffect, useState } from "react";
import {
  Squares2X2Icon,
  UsersIcon,
  CircleStackIcon,
  Square3Stack3DIcon,
  InboxStackIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { NavItem } from "./NavItem";
import { NavGroup } from "./NavGroup";
import { usePathname } from "next/navigation";

const icons = {
  Squares2X2Icon,
  UsersIcon,
  CircleStackIcon,
  Square3Stack3DIcon,
  InboxStackIcon,
  Cog6ToothIcon,
};

const tools = [
  { name: "Dashboard", route: "/", icon: "Squares2X2Icon" },
  { name: "Quản lý vị trí", route: "/locations", icon: "Square3Stack3DIcon" },
];

export const SideBar = (props) => {
  const { showSidebar, onSignOut } = props;
  const pathname = usePathname();
  const [open, setOpen] = useState([]);

  useEffect(() => {}, [pathname]);

  return (
    <div
      className={`fixed left-0 inset-y-0 h-screen z-40 w-68 flex flex-col justify-between border-r
      transition-all duration-500 ease-in-out shadow-custom bg-sidebar text-onSidebar ${
        showSidebar ? "" : "-translate-x-full"
      }`}
    >
      <div>
        <div className="p-4">
          <div className="flex justify-center items-center mb-2">
            <Logo classNameImg="h-16" />
          </div>
        </div>
        <hr className="bg-onSidebar" />
        <nav className="flex flex-col gap-1 text-sm font-normal text-inherit h-sidebar overflow-scroll mt-4 px-3">
          {tools?.map((item, index) => {
            const Icon = icons[item.icon];
            if (!item.items)
              return (
                <NavItem
                  key={index}
                  item={item}
                  pathname={pathname}
                  Icon={Icon}
                />
              );
            else
              return (
                <NavGroup
                  key={index}
                  item={item}
                  value={index + 1}
                  open={open}
                  setOpen={setOpen}
                  pathname={pathname}
                  Icon={Icon}
                />
              );
          })}
        </nav>
      </div>
      <div className="p-3 border-t border-onSidebar">
        <Buttonz
          outlined
          onClick={() => onSignOut()}
          className="w-full flex gap-2 truncate"
          label="Đăng xuất"
        />
      </div>
    </div>
  );
};
