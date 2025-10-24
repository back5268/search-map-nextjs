"use client";

import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function LocationMarker({ onSelect }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onSelect({ lat, lng });
    },
  });

  return position ? (
    <Marker position={position}>
      <Popup>
        <b>Vị trí đã chọn:</b>
        <br />
        Lat: {position[0].toFixed(6)}, Lng: {position[1].toFixed(6)}
      </Popup>
    </Marker>
  ) : null;
}

export default function LocationMap({ setLocation, height = 'h-[1000px]' }) {
  return (
    <MapContainer
      center={[21.027629289365255, 105.85234880447388]}
      zoom={16}
      className={`w-full ${height}`}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker onSelect={(e) => setLocation(e)} />
    </MapContainer>
  );
};
