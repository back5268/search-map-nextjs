"use client";

import React, { useState } from "react";
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
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);

  return (
    <div className="w-full h-[calc(100vh-120px)]">
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

        {coords.map((zone, index) => (
          <Polygon
            key={index}
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

        {locations.map((loc, index) => (
          <Marker
            key={index}
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
};
