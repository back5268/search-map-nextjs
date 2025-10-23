"use client"

import React, { useEffect, useState } from "react";
import { useAccountState, useToastState } from "@/store";
import { TopBar } from "@/components/layout/TopBar";
import { SideBar } from "@/components/layout/SideBar";
import { usePostData } from "@/hooks/usePostData";
import { useRouter } from "next/navigation";

export default function Layout({ children }) {
  const router = useRouter()
  const [showSidebar, setShowSidebar] = useState(true);
  const { clearAccount, setLoadingz } = useAccountState();
  const { showToast } = useToastState();
  const { mutateAsync } = usePostData("/api/auth/logout");

  const onSignOut = async () => {
    await mutateAsync()
    clearAccount();
    showToast({ title: "Đăng xuất thành công", severity: "success" });
    router.push('/auth/login')
  };

  useEffect(() => {
    const checkWindowSize = () => {
      if (window.innerWidth < 1024) setShowSidebar(false);
      else setShowSidebar(true);
    };
    checkWindowSize();
    window.addEventListener("resize", checkWindowSize);
    return () => {
      window.removeEventListener("resize", checkWindowSize);
    };
  }, []);

  return (
    <div className="antialiased">
      {showSidebar && (
        <div
          onClick={() => setShowSidebar(false)}
          className="fixed inset-x-0 inset-y-0 bg-black bg-opacity-50 z-30 w-screen h-screen block lg:hidden"
        ></div>
      )}
      <TopBar
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        onSignOut={onSignOut}
      />
      <SideBar showSidebar={showSidebar} onSignOut={onSignOut} />
      <div
        className={`relative transition-all duration-500 ease-in-out py-8 px-6 mt-14 ${
          showSidebar ? "lg:ml-68" : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
}
