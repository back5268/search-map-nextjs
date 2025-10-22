"use client";

import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Dialog } from "primereact/dialog";

export const tdpPolygons = [
  {
    id: 22,
    name: "TDP Số 22",
    location_name: "Tổ 2 - CỬA NAM CŨ",
    color: "#dda500",
    coords: [
      [21.02739794848459, 105.84228790329763],
      [21.026427929633627, 105.84557561219475],
      [21.02671893595131, 105.84567481030751],
      [21.026705708403654, 105.84553782243665],
      [21.026824756290452, 105.84539138712711],
      [21.02719512688229, 105.84515992486286],
      [21.02729653771739, 105.84528274157458],
      [21.02738472099719, 105.84516464858217],
      [21.0274729042237, 105.84491901515867],
      [21.027627224743938, 105.84474423753096],
      [21.027949092745843, 105.84432855019901],
      [21.027891773837553, 105.8441537725713],
      [21.027724226132804, 105.84411598281315],
      [21.0277506810462, 105.84397899494229],
      [21.02781240915843, 105.843771151277],
      [21.02739794848459, 105.84228790329763],
    ],
  },
  {
    id: 23,
    name: "TDP Số 23",
    location_name: "Tổ 1 - CỬA NAM CŨ",
    color: "#6ddddd",
    coords: [
      [21.028319457989554, 105.84161241281322],
      [21.027666904583768, 105.84158879421551],
      [21.027596358098364, 105.84171161092718],
      [21.027402355091013, 105.84227373356862],
      [21.02781240660414, 105.84377587642757],
      [21.027746269339275, 105.84398372009292],
      [21.027865316394923, 105.84405457588855],
      [21.027966726774025, 105.84401678613051],
      [21.028037273084166, 105.84387507454034],
      [21.028478186764417, 105.84302008127878],
      [21.029020508803484, 105.8425524330296],
      [21.028319457989554, 105.84161241281322],
    ],
  },
];

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const defaultLocations = [
  {
    id: 22,
    name: "TDP số 22",
    location_name: " Tổ 2 - CỬA NAM CŨ",
    lat: 21.027446449260978,
    lng: 105.84421990464648,
  },
  {
    id: 23,
    name: "TDP số 23",
    location_name: " Tổ 1 - CỬA NAM CŨ",
    lat: 21.028359140199385,
    lng: 105.84250047211361,
  },
];

export default function MapView() {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);

  return (
    <div className="w-full h-[calc(100vh-120px)] z-10">
      <Dialog
        modal={false}
        header={selected?.name || "Chi tiết TDP"}
        visible={visible}
        style={{ width: "25vw", height: "100vh" }}
        onHide={() => setVisible(false)}
        position="left"
      >
        <p>
          Đây là thông tin chi tiết của <b>{selected?.name}</b>.
        </p>
        <p>
          Toạ độ trung tâm: {selected?.lat}, {selected?.lng}
        </p>
      </Dialog>

      <MapContainer
        center={[21.028511, 105.854167]}
        zoom={14}
        className="w-full h-[calc(100vh-120px)]"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="z-10"
        />

        {tdpPolygons.map((zone) => (
          <Polygon
            key={zone.id}
            pathOptions={{
              color: zone.color,
              fillOpacity: 0.4,
              weight: 2,
            }}
            positions={zone.coords}
            eventHandlers={{
              click: () => {
                setSelected(zone);
                setVisible(true);
              },
            }}
          >
            <Popup>{zone.name}</Popup>
          </Polygon>
        ))}

        {defaultLocations.map((loc) => (
          <Marker
            key={loc.id}
            position={[loc.lat, loc.lng]}
            eventHandlers={{
              click: () => {
                setSelected(loc);
                setVisible(true);
              },
            }}
          >
            <Popup>
              <b>{loc.name}</b>
              <br />
              Lat: {loc.lat}, Lng: {loc.lng}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
