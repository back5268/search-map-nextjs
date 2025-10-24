"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";

const PolygonDrawer = ({ onPolygonsChange }) => {
  const map = useMap();

  useEffect(() => {
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
      edit: { featureGroup: drawnItems },
      draw: {
        polygon: true,
        polyline: false,
        rectangle: false,
        circle: false,
        marker: false,
        circlemarker: false,
      },
    });
    map.addControl(drawControl);

    // Cập nhật toàn bộ danh sách tọa độ
    const updateAllCoords = () => {
      const allCoords = [];
      drawnItems.eachLayer((layer) => {
        if (layer instanceof L.Polygon) {
          const latlngs = layer.getLatLngs()[0].map((p) => ({
            lat: p.lat,
            lng: p.lng,
          }));
          allCoords.push(latlngs);
        }
      });
      onPolygonsChange?.(allCoords);
    };

    // Khi tạo mới polygon
    map.on(L.Draw.Event.CREATED, (event) => {
      drawnItems.addLayer(event.layer);
      updateAllCoords();
    });

    // Khi xóa hoặc chỉnh sửa
    map.on(L.Draw.Event.DELETED, updateAllCoords);
    map.on(L.Draw.Event.EDITED, updateAllCoords);

    return () => {
      map.removeControl(drawControl);
      map.off(L.Draw.Event.CREATED);
      map.off(L.Draw.Event.DELETED);
      map.off(L.Draw.Event.EDITED);
    };
  }, [map, onPolygonsChange]);

  return null;
};

export default function CoordMap({ setCoords, height = "h-[1000px]" }) {
  return (
    <MapContainer
      center={[21.027629289365255, 105.85234880447388]}
      zoom={16}
      className={`w-full ${height}`}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <PolygonDrawer onPolygonsChange={setCoords} />
    </MapContainer>
  );
}
