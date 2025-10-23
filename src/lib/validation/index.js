import * as yup from "yup";

export const LoginValidation = yup.object({
  username: yup
    .string()
    .min(3, "Tài khoản cần dài ít nhất 3 ký tự!")
    .required(),
  password: yup.string().min(6, "Mật khẩu cần dài ít nhất 6 ký tự!").required(),
});

export const ForgotPasswordValidation = yup.object({
  username: yup
    .string()
    .min(3, "Tài khoản cần dài ít nhất 3 ký tự!")
    .required(),
  otp: yup.string().min(6, "Mã otp cần dài ít nhất 6 ký tự!").required(),
  password: yup
    .string()
    .min(6, "Mật khẩu cần dài ít nhất 6 ký tự!")
    .required(),
});
