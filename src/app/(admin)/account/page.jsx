"use client";

import { TimeBody } from "@/components/base/BodyTable";
import { DataFilter } from "@/components/base/DataFilter";
import { DataTable } from "@/components/base/DataTable";
import { FormList } from "@/components/base/FormList";
import { Columnz, Dropdownzz, Inputzz } from "@/components/core";
import { Account } from "@/components/view/Account";
import { useGetData } from "@/hooks/useGetData";
import { useGetParams } from "@/hooks/useGetParams";
import React, { useState } from "react";

export default function AccountPage() {
  const initParams = useGetParams();
  const [params, setParams] = useState(initParams);
  const [filter, setFilter] = useState({});
  const [open, setOpen] = useState(false);
  const { isLoading, data: dataz } = useGetData("/api/account", params);
  const data = dataz?.data?.data || [],
    count = data?.data?.count || 0;

  return (
    <FormList title="Danh sách người dùng">
      <Account
        open={open}
        setOpen={setOpen}
        setParams={setParams}
        data={data}
      />
      <DataFilter
        setParams={setParams}
        filter={filter}
        setFilter={setFilter}
        className="lg:w-6/12"
      >
        <Inputzz
          value={filter.name}
          onChange={(e) => setFilter({ ...filter, name: e.target.value })}
          label="Tìm kiếm theo tên, tài khoản, email"
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
        title="người dùng"
        loading={isLoading}
        data={data}
        total={count}
        params={params}
        setParams={setParams}
        baseActions={["create", "detail", "delete"]}
        actionsInfo={{
          onViewDetail: (item) => setOpen(item._id),
          deleteRoute: "/api/account",
        }}
        statusInfo={{ changeStatusRoute: "/api/account" }}
        headerInfo={{ onCreate: () => setOpen(true) }}
      >
        <Columnz header="Họ tên" field="fullName" />
        <Columnz header="Tài khoản" field="username" />
        <Columnz header="Email" field="email" />
        <Columnz
          header="Lần đăng nhập cuối"
          body={(e) => TimeBody(e.lastLogin)}
        />
        <Columnz header="Thời gian tạo" body={(e) => TimeBody(e.createdAt)} />
      </DataTable>
    </FormList>
  );
}
