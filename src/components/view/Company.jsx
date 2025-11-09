"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CompanyValidation } from "@/lib/validation";
import { DropdownFormz, InputFormz, TextAreaz } from "../core";
import { FormDetail } from "../base/FormDetail";
import { checkEqualProp } from "@/lib/helper";
import { useParams } from "next/navigation";
import { useGetData } from "@/hooks/useGetData";
import { ColorPicker } from "primereact/colorpicker";
import dynamic from "next/dynamic";
import { UploadFiles } from "../base/UploadFiles";

const OverviewMap = dynamic(() => import("./OverviewMap"), {
  ssr: false, // 🚫 disable SSR để tránh lỗi window/document
});
const LocationMap = dynamic(() => import("./LocationMap"), {
  ssr: false, // 🚫 disable SSR để tránh lỗi window/document
});
const CoordMap = dynamic(() => import("./CoordMap"), {
  ssr: false, // 🚫 disable SSR để tránh lỗi window/document
});

const defaultValues = {
  name: "",
  tax: "",
  address: "",
  description: "",
  owner: "",
  type: 1,
  color: "#0891b2",
};

export const Company = () => {
  const { id } = useParams();
  const isUpdate = !!id;
  const { data: item } =
    useGetData(`/api/company/${id}`, {}, false, isUpdate) || {};
  const [location, setLocation] = useState({});
  const [coords, setCoords] = useState([]);
  const [files, setFiles] = useState([]);
  const [pccc, setPccc] = useState([]);

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
      if (item.data.files) setFiles(item.data.files)
      if (item.data.pccc) setPccc(item.data.pccc)
    }
  }, [item]);

  const handleData = (data) => {
    const newData = { ...data };
    newData.formData = { files, pccc }
    if (!isUpdate) {
      newData.location = location;
      newData.coords = coords.map((coord) => coord.map((c) => [c.lat, c.lng]));
    }
    if (isUpdate) return { ...checkEqualProp(newData, item), _id: id };
    else return newData;
  };

  return (
    <FormDetail
      type="nomal"
      title="công ty"
      isUpdate={isUpdate}
      handleData={handleData}
      handleSubmit={handleSubmit}
      create={{ route: "/api/company", isUpload: true }}
      update={{ route: `/api/company/${id}`, isUpload: true }}
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
            id="owner"
            label="Chủ kinh doanh (*)"
            value={watch("owner")}
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

          {watch("type") === 2 ? (
            <div className="lg:w-6/12 px-2">
              <div className="w-full rounded-md border border-border flex px-2">
                <label className="w-full py-4 font-medium">Màu sắc</label>
                <div className="flex items-center gap-4">
                  <ColorPicker
                    value={watch("color")}
                    onChange={(e) => setValue("color", `#${e.value}`)}
                    format="hex"
                  />
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
          <UploadFiles label="Giấy phép kinh doanh" files={files} setFiles={setFiles}/>
          <UploadFiles label="Hồ sơ PCCC" files={pccc} setFiles={setPccc}/>
        </div>
        <div className="px-2 mt-4">
          {isUpdate ? (
            <OverviewMap
              locations={location?.lat ? [location] : []}
              coords={
                coords?.[0]
                  ? coords.map((coord) => ({
                      name: item?.data?.name,
                      address: item?.data?.address,
                      coords: coord,
                      color: item?.data?.color,
                    }))
                  : []
              }
            />
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
