"use client";

import { Buttonz, Inputz } from "@/components/core";
import { AuthWrapper, InputPassword } from "@/components/base";

export default function LogIn() {
  return (
    <AuthWrapper
      headerLabel="Vui lòng đăng nhập để tiếp tục"
      footerLabel="Quên mật khẩu"
      footerHref="/auth/forgot-password"
    >
      <form className="flex flex-col justify-center gap-6">
        <Inputz id="username" label="Tài khoản (*)" />
        <InputPassword
          id="password"
          label="Mật khẩu (*)"
        />
        <Buttonz type="submit" label="Đăng nhập" />
      </form>
    </AuthWrapper>
  );
}
