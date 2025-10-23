"use client"

import Image from "next/image";

export const Logo = ({ className = "", classNameImg = "h-16" }) => (
  <div className={`flex justify-center items-center ${className}`}>
    <Image
      src="/images/logo.png"
      alt="Logo"
      width={160}
      height={80}
      priority // 👈 bắt load sớm, tránh lỗi lazy
      unoptimized // 👈 tắt optimize trong dev
      className={`${classNameImg} w-auto object-contain`}
    />
  </div>
);
