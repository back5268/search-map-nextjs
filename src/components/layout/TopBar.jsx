"use client"

import { Buttonz } from "@/components/core";
import { Bars3Icon } from "@heroicons/react/24/outline";
import React from "react";
import { AvatarSection } from "./AvatarSection";

export const TopBar = (props) => {
  const { showSidebar, setShowSidebar, onSignOut } = props;

  return (
    <div className="fixed top-0 inset-x-0 px-6 z-20 py-1 bg-surface shadow-custom">
      <div
        className={`h-14 transition-all duration-500 ease-in-out ${
          showSidebar ? "lg:ml-68" : ""
        }`}
      >
        <div className="flex justify-between items-center h-full">
          <Buttonz
            onClick={() => setShowSidebar(!showSidebar)}
            className="h-9 w-9 flex justify-center items-center"
            icon={<Bars3Icon className="w-8 stroke-2" />}
          />
          <div className="flex gap-3 justify-between items-center mr-2">
            <AvatarSection onSignOut={onSignOut} />
          </div>
        </div>
      </div>
    </div>
  );
};
