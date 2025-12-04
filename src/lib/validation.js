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
  password: yup.string().min(6, "Mật khẩu cần dài ít nhất 6 ký tự!").required(),
});

export const CompanyValidation = yup.object({
  // name: yup.string().required("Tên công ty không được bỏ trống!"),
  // tax: yup.string().required("Mã số thuê không được bỏ trống!"),
  address: yup.string().required("Địa chỉ không được bỏ trống!"),
});

export const AccountValidation = yup.object({
  fullName: yup.string().required("Họ tên không được bỏ trống!"),
  username: yup.string().required("Tài khoản không được bỏ trống!"),
  email: yup
    .string()
    .email("Email không đúng định dạng!")
    .required("Email không được bỏ trống!"),
});
