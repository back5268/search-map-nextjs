"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { AccountValidation } from "@/lib/validation";
import { FormDetail } from "../base/FormDetail";
import { InputFormz } from "../core";
import { checkEqualProp } from "@/lib/helper";

const defaultValues = {
  fullName: "",
  email: "",
  username: "",
};

export const Account = (props) => {
  const { open, setOpen, setParams, data } = props;
  const isUpdate = typeof open === "string";
  const item = isUpdate ? data.find((d) => d._id === open) : {};

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(AccountValidation),
    defaultValues,
  });

  useEffect(() => {
    if (isUpdate) {
      for (const key in defaultValues) {
        setValue(key, item[key]);
      }
    }
  }, [item]);

  const handleData = (data) => {
    const newData = { ...data };
    if (isUpdate) return { ...checkEqualProp(newData, item), _id: open };
    else return newData;
  };

  return (
    <FormDetail
      title="người dùng"
      open={open}
      setOpen={() => {
        setOpen(false);
        reset();
      }}
      isUpdate={isUpdate}
      handleData={handleData}
      handleSubmit={handleSubmit}
      setParams={setParams}
      create={{ route: "/api/account" }}
      update={{ route: `/api/account/${open}` }}
    >
      <div className="flex flex-wrap w-full">
        <InputFormz
          id="fullName"
          label="Họ tên (*)"
          value={watch("fullName")}
          errors={errors}
          register={register}
        />
        <InputFormz
          id="email"
          label="Email (*)"
          value={watch("email")}
          errors={errors}
          register={register}
        />
        <InputFormz
          id="username"
          label="Tài khoản (*)"
          value={watch("username")}
          errors={errors}
          register={register}
        />
      </div>
    </FormDetail>
  );
};
