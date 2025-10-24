"use client";

import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";

// --- Cấu hình icon mặc định ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// --- Component tìm kiếm vị trí ---
function SearchBox({ onSelect }) {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();

    const searchControl = new GeoSearchControl({
      provider,
      style: "bar",
      showMarker: true,
      showPopup: true,
      autoClose: true,
      retainZoomLevel: false,
      searchLabel: "Tìm địa điểm...",
      marker: {
        icon: new L.Icon.Default(),
        draggable: false,
      },
      popupFormat: ({ query, result }) => result.label,
    });

    map.whenReady(() => {
      map.addControl(searchControl);
    });

    // Lắng nghe sự kiện khi chọn kết quả tìm kiếm
    map.on("geosearch/showlocation", (e) => {
      const { x: lng, y: lat } = e.location;
      onSelect({ lat, lng });
    });

    return () => {
      map.removeControl(searchControl);
      map.off("geosearch/showlocation");
    };
  }, [map, onSelect]);

  return null;
}

// --- Component chọn vị trí thủ công ---
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

// --- Bản đồ chính ---
export default function LocationMap({ setLocation, height = "h-[600px]" }) {
  return (
    <MapContainer
      center={[21.027629289365255, 105.85234880447388]}
      zoom={15}
      className={`w-full ${height}`}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <SearchBox onSelect={(pos) => setLocation(pos)} />
      <LocationMarker onSelect={(pos) => setLocation(pos)} />
    </MapContainer>
  );
}
