"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
import L from "leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import Link from "next/link";
import { Inputz } from "../core";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useGetData } from "@/hooks/useGetData";

// --- Cấu hình icon mặc định cho marker ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// --- Component SearchBox ---
function SearchBox() {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();

    const searchControl = new GeoSearchControl({
      provider,
      style: "bar", // thanh tìm kiếm nằm ngang
      showMarker: true,
      showPopup: true,
      autoClose: true,
      retainZoomLevel: false,
      searchLabel: "Tìm địa điểm...",
      marker: {
        icon: new L.Icon.Default(),
        draggable: false,
      },
      popupFormat: ({ result }) => `${result.label}`,
    });

    map.whenReady(() => {
      map.addControl(searchControl);
    });

    return () => {
      map.removeControl(searchControl);
    };
  }, [map]);

  return null;
}

// --- Component chính ---
export default function OverviewMap({ coords = [], locations = [] }) {
  const mapRef = useRef();
  const [params, setParams] = useState({});
  const [query, setQuery] = useState("");
  const { data: item } = useGetData("/api/company/search", params);
  const markerRefs = useRef({});
  const polygonRefs = useRef({});

  useEffect(() => {
    const itemz = item?.data;
    if (!itemz || !mapRef.current) return;

    if (itemz.lat && itemz.lng) {
      mapRef.current.setView([itemz.lat, itemz.lng], 18, {
        animate: true,
      });
    }

    if (itemz.coords?.length) {
      const bounds = L.latLngBounds(itemz.coords);
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [item]);

  return (
    <div className="relative w-full h-[calc(100vh-120px)]">
      <div className="absolute top-2 right-2 z-[9999] rounded w-[600px]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setParams({ address: query });
          }}
        >
          <div className="p-inputgroup flex-1">
            <InputText
              placeholder="Nhập địa chỉ ....."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button type="submit">
              <MagnifyingGlassIcon className="w-6 h-6" />
            </Button>
          </div>
        </form>
      </div>
      <MapContainer
        center={[21.027629289365255, 105.85234880447388]}
        zoom={16}
        className="w-full h-[calc(100vh-120px)]"
        ref={mapRef}
      >
        {/* Lớp bản đồ nền */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="z-10"
        />

        {/* Ô tìm kiếm vị trí */}
        {/* <SearchBox /> */}

        {/* Vẽ các vùng (Polygon) */}
        {!!coords?.length &&
          coords
            .filter((c) => c)
            .map((item, index) => (
              <Polygon
                key={index}
                pathOptions={{
                  color: item.color || "#0891b2",
                  fillOpacity: 0.4,
                  weight: 2,
                }}
                positions={item.coords}
              >
                <Popup>
                  <div className="flex flex-col gap-1">
                    <b>{item.name}</b>
                    <hr />
                    <span>Địa chỉ: {item.address}</span>
                    <span>Chủ kinh doanh: {item.owner}</span>
                    <span>Mã số thuế: {item.tax}</span>
                    <span>Giấy phép đăng ký kinh doanh:</span>
                    {item.files?.map((link, index) => (
                      <Link
                        key={index}
                        href={link}
                        target="_blank"
                        className="block w-full truncate text-blue-600 hover:underline"
                      >
                        {link}
                      </Link>
                    ))}
                    <span>Hồ sơ PCCC:</span>
                    {item.pccc?.map((link, index) => (
                      <Link
                        key={index}
                        href={link}
                        target="_blank"
                        className="block w-full truncate text-blue-600 hover:underline"
                      >
                        {link}
                      </Link>
                    ))}
                  </div>
                </Popup>
              </Polygon>
            ))}

        {/* Hiển thị danh sách Marker */}
        {!!locations?.length &&
          locations
            .filter((l) => l)
            .map((item, index) => (
              <Marker key={index} position={[item.lat, item.lng]}>
                <Popup>
                  <div className="flex flex-col gap-1">
                    <b>{item.name}</b>
                    <hr />
                    <span>Địa chỉ: {item.address}</span>
                    <span>Chủ kinh doanh: {item.owner}</span>
                    <span>Mã số thuế: {item.tax}</span>
                    <span>Giấy phép đăng ký kinh doanh:</span>
                    {item.files?.map((link, index) => (
                      <Link
                        key={index}
                        href={link}
                        target="_blank"
                        className="block w-full truncate text-blue-600 hover:underline"
                      >
                        {link}
                      </Link>
                    ))}
                    <span>Hồ sơ PCCC:</span>
                    {item.pccc?.map((link, index) => (
                      <Link
                        key={index}
                        href={link}
                        target="_blank"
                        className="block w-full truncate text-blue-600 hover:underline"
                      >
                        {link}
                      </Link>
                    ))}
                  </div>
                </Popup>
              </Marker>
            ))}
      </MapContainer>
    </div>
  );
}
