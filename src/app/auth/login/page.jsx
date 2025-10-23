"use client";

import { AuthWrapper } from "@/components/base/AuthWrapper";
import { InputPassword } from "@/components/base/InputPassword";
import { Buttonz, Inputz } from "@/components/core";
import { usePostData } from "@/hooks/usePostData";
import { LoginValidation } from "@/lib/validation";
import { useToastState } from "@/store";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function LogIn() {
  const router = useRouter();
  const { mutateAsync, isPending } = usePostData("/api/auth/login");
  const { showToast } = useToastState();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(LoginValidation),
  });
  const onSubmit = async (data) => {
    const response = await mutateAsync(data);
    if (response?.status) {
      router.push("/");
      showToast({ title: "Đăng nhập thành công", severity: "success" });
    } else showToast({ title: response.mess || "", severity: "error" });
  };

  return (
    <AuthWrapper
      headerLabel="Vui lòng đăng nhập để tiếp tục"
      footerLabel="Quên mật khẩu"
      footerHref="/auth/forgot-password"
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
        <InputPassword
          id="password"
          label="Mật khẩu (*)"
          value={watch("password")}
          register={register}
          errors={errors}
        />
        <Buttonz type="submit" loading={isPending} label="Đăng nhập" />
      </form>
    </AuthWrapper>
  );
}
