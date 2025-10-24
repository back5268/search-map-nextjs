"use client";

import React, { useEffect } from "react";
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
  return (
    <div className="w-full h-[calc(100vh-120px)]">
      <MapContainer
        center={[21.027629289365255, 105.85234880447388]}
        zoom={16}
        className="w-full h-[calc(100vh-120px)]"
      >
        {/* Lớp bản đồ nền */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="z-10"
        />

        {/* Ô tìm kiếm vị trí */}
        <SearchBox />

        {/* Vẽ các vùng (Polygon) */}
        {!!coords?.length &&
          coords.map((item, index) => (
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
                  <span>Mã số thuế: {item.tax}</span>
                </div>
              </Popup>
            </Polygon>
          ))}

        {/* Hiển thị danh sách Marker */}
        {!!locations?.length &&
          locations.map((item, index) => (
            <Marker key={index} position={[item.lat, item.lng]}>
              <Popup>
                <div className="flex flex-col gap-1">
                  <b>{item.name}</b>
                  <hr />
                  <span>Địa chỉ: {item.address}</span>
                  <span>Mã số thuế: {item.tax}</span>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}
