"use client";

import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export const OverviewNap = ({ coords = [], locations = [] }) => {
  return (
    <div className="w-full h-[calc(100vh-120px)]">
      <MapContainer
        center={[21.027629289365255, 105.85234880447388]}
        zoom={16}
        className="w-full h-[calc(100vh-120px)]"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="z-10"
        />

        {!!coords?.length
          ? coords.map((item, index) => (
              <Polygon
                key={index}
                pathOptions={{
                  color: item.color,
                  fillOpacity: 0.4,
                  weight: 2,
                }}
                positions={item.coords}
                eventHandlers={{
                  click: () => {},
                }}
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
            ))
          : ""}

        {!!locations?.length
          ? locations.map((item, index) => (
              <Marker
                key={index}
                position={[item.lat, item.lng]}
                eventHandlers={{
                  click: () => {},
                }}
              >
                <Popup>
                  <div className="flex flex-col gap-1">
                    <b>{item.name}</b>
                    <hr />
                    <span>Địa chỉ: {item.address}</span>
                    <span>Mã số thuế: {item.tax}</span>
                  </div>
                </Popup>
              </Marker>
            ))
          : ""}
      </MapContainer>
    </div>
  );
};
