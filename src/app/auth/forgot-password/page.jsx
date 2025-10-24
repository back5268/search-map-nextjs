"use client"

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Buttonz, Inputz } from "@/components/core";
import { useState } from "react";
import { ForgotPasswordValidation } from "@/lib/validation";
import { AuthWrapper } from "@/components/base/AuthWrapper";
import { useMutationData } from "@/hooks/useMutationData";
import { useRouter } from "next/navigation";
import { InputOtp } from "@/components/base/InputOtp";
import { InputPassword } from "@/components/base/InputPassword";
import { useToastState } from "@/store/toastState";

export default function ForgotPassword() {
  const router = useRouter();
  const { showToast } = useToastState();
  const { mutateAsync, isPending } = useMutationData("/api/auth/confirm-password");
  const [isSend, setIsSend] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(ForgotPasswordValidation),
  });
  const onSubmit = async (data) => {
    const response = await mutateAsync(data);
    if (response.status) {
      showToast({ title: "Đổi mật khẩu thành công", severity: "success" });
      router.push("/auth/login");
    } else showToast({ title: response.mess || "", severity: "error" });
  };

  return (
    <AuthWrapper
      headerLabel="Quên mật khẩu"
      footerLabel="Quay trở lại đăng nhập"
      footerHref="/auth/login"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-center gap-6"
      >
        <Inputz
          id="username"
          label="Tài khoản (*)"
          value={watch("username")}
          register={register}
          errors={errors}
        />
        <InputOtp
          id="otp"
          value={watch("otp")}
          username={watch("username")}
          register={register}
          errors={errors}
          isSend={isSend}
          setIsSend={setIsSend}
          sendOtpRoute="/api/auth/forgot-password"
        />
        {isSend && (
          <InputPassword
            id="password"
            label="Mật khẩu (*)"
            value={watch("password")}
            register={register}
            errors={errors}
          />
        )}
        <Buttonz
          type="submit"
          loading={isPending}
          disabled={!isSend}
          label="Xác nhận"
        />
      </form>
    </AuthWrapper>
  );
}
