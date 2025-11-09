"use client";

import { DataFilter } from "@/components/base/DataFilter";
import { DataTable } from "@/components/base/DataTable";
import { FormList } from "@/components/base/FormList";
import { Columnz, Dropdownzz, Inputzz } from "@/components/core";
import { useGetData } from "@/hooks/useGetData";
import { useGetParams } from "@/hooks/useGetParams";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function CompanyPage() {
  const router = useRouter();
  const initParams = useGetParams();
  const [params, setParams] = useState(initParams);
  const [filter, setFilter] = useState({});
  const { isLoading, data: dataz } = useGetData("/api/company", params);
  const data = dataz?.data?.data || [],
    count = dataz?.data?.count || 0;
    

  return (
    <FormList title="Danh sách công ty">
      <DataFilter
        setParams={setParams}
        filter={filter}
        setFilter={setFilter}
        className="lg:w-3/12"
      >
        <Inputzz
          value={filter.name}
          onChange={(e) => setFilter({ ...filter, name: e.target.value })}
          label="Tìm kiếm theo tên công ty, MST"
        />
        <Inputzz
          value={filter.address}
          onChange={(e) => setFilter({ ...filter, address: e.target.value })}
          label="Tìm kiếm theo địa chỉ"
        />
        <Dropdownzz
          value={filter.type}
          onChange={(e) => setFilter({ ...filter, type: e.target.value })}
          options={[
            { _id: 0, name: "Dừng hoạt động" },
            { _id: 1, name: "Hoạt động" },
          ]}
          label="Trạng thái"
        />
      </DataFilter>
      <DataTable
        title="công ty"
        loading={isLoading}
        data={data}
        total={count}
        params={params}
        setParams={setParams}
        baseActions={["create", "detail", "delete"]}
        actionsInfo={{
          onViewDetail: (item) => router.push(`/company/${item._id}`),
          deleteRoute: "/api/company",
        }}
        statusInfo={{ changeStatusRoute: "/api/company", isUpload: true }}
        headerInfo={{ onCreate: () => router.push("/company/create") }}
      >
        <Columnz header="Tên công ty" field="name" />
        <Columnz header="Mã số thuế" field="tax" />
        <Columnz header="Địa chỉ" field="address" />
        <Columnz header="Mô tả" field="description" />
      </DataTable>
    </FormList>
  );
}
