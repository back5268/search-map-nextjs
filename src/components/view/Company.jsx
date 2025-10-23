"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CompanyValidation } from "@/lib/validation";
import { DropdownFormz, InputFormz, TextAreaz } from "../core";
import { FormDetail } from "../base/FormDetail";
import { checkEqualProp } from "@/lib/helper";
import { OverviewNap } from "./OverViewMap";
import { LocationMap } from "./LocationMap";
import { CoordMap } from "./CoordMap";
import { useParams } from "next/navigation";
import { useGetData } from "@/hooks/useGetData";

const defaultValues = {
  name: "",
  tax: "",
  address: "",
  description: "",
  type: 1,
};

export const Company = () => {
  const { id } = useParams();
  const isUpdate = !!id;
  const { data: item } = useGetData(`/api/company/${id}`) || {};
  const [location, setLocation] = useState({});
  const [coords, setCoords] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(CompanyValidation),
    defaultValues,
  });

  useEffect(() => {
    if (isUpdate && item?.data) {
      for (const key in defaultValues) {
        setValue(key, item.data[key]);
      }
      if (Number(item.data.type) === 1) setLocation(item.data.location);
      else setCoords(item.data.coords);
    }
  }, [item]);

  const handleData = (data) => {
    const newData = { ...data, location, coords };
    if (isUpdate) return { ...checkEqualProp(newData, item), _id: open };
    else return newData;
  };

  return (
    <FormDetail
      type="nomal"
      title="công ty"
      open={open}
      setOpen={() => {
        setOpen(false);
        reset();
      }}
      isUpdate={isUpdate}
      handleData={handleData}
      handleSubmit={handleSubmit}
      create={{ route: "/api/company" }}
      update={{ route: `/api/company/${id}` }}
    >
      <div className="h-[700px] overflow-scroll pt-2">
        <div className="flex flex-wrap w-full">
          <InputFormz
            id="name"
            label="Tên công ty (*)"
            value={watch("name")}
            errors={errors}
            register={register}
          />
          <InputFormz
            id="tax"
            label="Mã số thuế (*)"
            value={watch("tax")}
            errors={errors}
            register={register}
          />
          <InputFormz
            id="address"
            label="Địa chỉ (*)"
            value={watch("address")}
            errors={errors}
            register={register}
          />
          <DropdownFormz
            id="type"
            label="Loại vị trí (*)"
            options={[
              { _id: 1, name: "Theo tọa độ" },
              { _id: 2, name: "Theo vùng" },
            ]}
            value={watch("type")}
            errors={errors}
            register={register}
            onChange={(e) => {
              setValue("type", e.target.value);
              setCoords([]);
              setLocation({});
            }}
            disabled={isUpdate}
          />
          <TextAreaz
            id="description"
            label="Mô tả"
            value={watch("description")}
            errors={errors}
            register={register}
          />
        </div>
        <div className="px-2">
          {isUpdate ? (
            <OverviewNap locations={location?.lat ? [location] : []} coords={coords?.[0] ? [coords] : []} />
          ) : watch("type") === 1 ? (
            <LocationMap setLocation={setLocation} height={"h-[700px]"} />
          ) : (
            <CoordMap setCoords={setCoords} height={"h-[700px]"} />
          )}
        </div>
      </div>
    </FormDetail>
  );
};
