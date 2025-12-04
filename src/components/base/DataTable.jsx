"use client";

import React, { useState } from "react";
import {
  TrashIcon,
  DocumentMagnifyingGlassIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";
import { removeSpecialCharacter } from "@/lib/helper";
import {
  Buttonz,
  Columnz,
  SplitButtonz,
  Switchz,
  Tablez,
} from "@/components/core";
import { confirmDialog } from "primereact/confirmdialog";
import { deleteData, postData } from "@/hooks/useMutationData";
import { useToastState } from "@/store/toastState";
import { useGetData } from "@/hooks/useGetData";

export const DataTable = (props) => {
  const { showToast } = useToastState();
  const [isLoading, setIsLoading] = useState(false);
  const {
    title,
    data = [],
    total = 0,
    loading = false,
    key = "_id",
    params = { page: 1, limit: 10 },
    setParams = () => {},
    actionsInfo = {},
    headerInfo = {},
    statusInfo = {},
    baseActions = [],
    rows = [10, 20, 50, 100, 200, 500],
    select,
    setSelect,
    onSuccess = () => {},
    hideParams,
  } = props;
  const {
    onViewDetail = () => {},
    onDelete,
    deleteRoute = "",
    handleDelete = (item) => ({ _id: item._id }),
    moreActions,
    isHideDelete = () => false,
  } = actionsInfo;
  const {
    onCreate = () => {},
    onImport = () => {},
    exportRoute,
    moreHeader,
    items,
  } = headerInfo;
  const {
    changeStatusRoute = "",
    handleChangeStatus = (item) => ({
      _id: item._id,
      status: item.status ? 0 : 1,
    }),
    isUpload,
  } = statusInfo;
  const isActions =
    baseActions.includes("detail") ||
    baseActions.includes("delete") ||
    Boolean(moreActions);
  const isHeader =
    baseActions.includes("create") ||
    baseActions.includes("import") ||
    baseActions.includes("export") ||
    moreHeader ||
    items;
  const isStatus = Boolean(statusInfo.changeStatusRoute);

  const onDeletez = (item) => {
    confirmDialog({
      message: "Bạn có chắc chắn muốn xóa dữ liệu này!",
      header: "Search Map",
      icon: "pi pi-info-circle",
      accept: async () => {
        const response = await deleteData(
          `${deleteRoute}/${item._id}`,
          handleDelete(item)
        );
        if (response?.status) {
          showToast({ title: "Xóa dữ liệu thành công!", severity: "success" });
          setParams((pre) => ({ ...pre, render: !pre.render }));
          onSuccess(item);
        } else showToast({ title: response.mess, severity: "error" });
      },
    });
  };

  const onExport = async () => {
    setIsLoading(true);
    const res = await fetch(exportRoute);
    setIsLoading(false);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.xlsx";
    a.click();
    URL.revokeObjectURL(url);
  };

  const onChangeStatus = (item) => {
    confirmDialog({
      message: "Bạn có chắc chắn muốn chuyển trạng thái dữ liệu này!",
      header: "Search Map",
      icon: "pi pi-info-circle",
      accept: async () => {
        const response = await postData(
          `${changeStatusRoute}/${item._id}`,
          "PUT",
          handleChangeStatus(item),
          isUpload
        );
        if (response?.status) {
          showToast({
            title: "Chuyển trạng thái thành công!",
            severity: "success",
          });
          setParams((pre) => ({ ...pre, render: !pre.render }));
          onSuccess(item);
        } else showToast({ title: response.mess, severity: "error" });
      },
    });
  };

  const handleSelect = (callback = () => {}) => {
    if (!(select?.length > 0))
      return showToast({
        title: `Vui lòng chọn ${title || "dữ liệu"}!`,
        severity: "warning",
      });
    callback();
  };

  const onPage = (event) => {
    setParams({
      ...params,
      limit: event.rows,
      page: event.page !== 0 ? event.page + 1 : 1,
    });
  };

  const header = (
    <div className="flex gap-4 justify-start mb-1">
      {baseActions.includes("create") && (
        <Buttonz onClick={onCreate}>Thêm mới</Buttonz>
      )}
      {baseActions.includes("import") && (
        <Buttonz
          severity="success"
          onClick={onImport}
          className="flex gap-4 items-center"
          icon={<ArrowUpTrayIcon className="h-5 w-5 stroke-2" />}
        >
          Import
        </Buttonz>
      )}
      {baseActions.includes("export") && (
        <Buttonz
          severity="success"
          onClick={onExport}
          loading={isLoading}
          className="flex gap-4 items-center"
          icon={<ArrowDownTrayIcon className="h-5 w-5 stroke-2" />}
        >
          Export
        </Buttonz>
      )}
      {items?.length > 0 && (
        <SplitButtonz
          model={items.map((item) => ({
            ...item,
            onClick: () => handleSelect(item.onClick),
          }))}
          label="Tác vụ"
          raised
        />
      )}
      {moreHeader?.length > 0 &&
        moreHeader.map((header, index) => {
          return (
            <Buttonz
              key={index}
              severity={header.severity}
              onClick={() => header.onClick()}
            >
              {header.children() || ""}
            </Buttonz>
          );
        })}
    </div>
  );

  return (
    <div className="w-full px-2 rounded-md overflow-hidden">
      <Tablez
        header={isHeader && header}
        params={params}
        rows={params.limit}
        value={data}
        totalRecords={total}
        rowsPerPageOptions={rows}
        onPage={onPage}
        dataKey={key}
        loading={loading}
        emptyMessage={"Không tìm thấy " + title?.toLowerCase() || ""}
        selection={select}
        onSelectionChange={(e) => {
          if (setSelect) setSelect(e.value);
        }}
      >
        {select && setSelect && <Columnz selectionMode="multiple" />}
        <Columnz header="#" body={(data, options) => options.rowIndex + 1} />
        {props.children}
        {isStatus && (
          <Columnz
            headerStyle={{ padding: "auto", textAlign: "center" }}
            header="Trạng thái"
            body={(item) => (
              <div className="flex justify-center items-center">
                <Switchz
                  checked={Boolean(item.status)}
                  onChange={() => onChangeStatus(item)}
                />
              </div>
            )}
          />
        )}
        {isActions && (
          <Columnz
            header="Thao tác"
            body={(item) => {
              const isHide = isHideDelete && isHideDelete(item);

              return (
                <div className="flex justify-center items-center gap-2">
                  {baseActions.includes("detail") && (
                    <Buttonz
                      onClick={() => onViewDetail(item)}
                      outlined
                      className="h-10 w-10 flex justify-center items-center"
                      icon={<DocumentMagnifyingGlassIcon className="w-6" />}
                    />
                  )}
                  {baseActions.includes("delete") && !isHide && (
                    <Buttonz
                      severity="danger"
                      outlined
                      onClick={() =>
                        onDelete ? onDelete(item) : onDeletez(item)
                      }
                      className="h-10 w-10 flex justify-center items-center"
                      icon={<TrashIcon className="w-5" />}
                    />
                  )}
                  {moreActions?.length > 0 &&
                    moreActions.map((action, index) => {
                      const severity = action.severity || "";
                      const Icon = action.icon;
                      const isHide = action.isHide && action.isHide(item);

                      return (
                        !isHide && (
                          <Buttonz
                            key={index}
                            severity={severity}
                            outlined
                            onClick={() => action.onClick(item)}
                            className="h-10 w-10 flex justify-center items-center"
                            icon={<Icon className="w-6" />}
                          />
                        )
                      );
                    })}
                </div>
              );
            }}
          />
        )}
      </Tablez>
    </div>
  );
};
