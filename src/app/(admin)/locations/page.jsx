"use client";

import { DataFilter } from "@/components/base/DataFilter";
import { DataTable } from "@/components/base/DataTable";
import { FormList } from "@/components/base/FormList";
import { Columnz, Inputzz } from "@/components/core";
import React, { useState } from "react";

export default function Locations() {
  const [params, setParams] = useState({});
  const [filter, setFilter] = useState({});

  return (
    <FormList title="Danh sách máy chấm công">
      <DataFilter
        setParams={setParams}
        filter={filter}
        setFilter={setFilter}
        className="lg:w-9/12"
      >
        <Inputzz
          value={filter.keySearch}
          onChange={(e) => setFilter({ ...filter, keySearch: e.target.value })}
          label="Tìm kiếm theo tên, mã"
        />
      </DataFilter>
      <DataTable
        title="máy chấm công"
        params={params}
        setParams={setParams}
        baseActions={["create", "detail", "delete"]}
      >
        <Columnz header="Tên thiết bị" field="name" />
        <Columnz header="Mã thiết bị" field="code" />
      </DataTable>
    </FormList>
  );
}
