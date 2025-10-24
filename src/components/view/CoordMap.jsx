"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";

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

    // Tính tất cả polygon
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

    map.on(L.Draw.Event.CREATED, (e) => {
      drawnItems.addLayer(e.layer);
      updateAllCoords();
    });
    map.on(L.Draw.Event.EDITED, updateAllCoords);
    map.on(L.Draw.Event.DELETED, updateAllCoords);

    return () => {
      map.removeControl(drawControl);
    };
  }, [map, onPolygonsChange]);

  return null;
};

const SearchBox = () => {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();

    const searchControl = new GeoSearchControl({
      provider,
      style: "bar",
      showMarker: true,
      showPopup: true,
      marker: {
        icon: new L.Icon.Default(),
        draggable: false,
      },
      popupFormat: ({ result }) => `${result.label}`,
      autoClose: true,
      retainZoomLevel: false,
    });

    map.addControl(searchControl);

    return () => map.removeControl(searchControl);
  }, [map]);

  return null;
};

export default function CoordMap({ setCoords, height = "h-[600px]" }) {
  return (
    <MapContainer
      center={[21.0276, 105.8523]}
      zoom={15}
      className={`w-full ${height}`}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <SearchBox />
      <PolygonDrawer onPolygonsChange={setCoords} />
    </MapContainer>
  );
}
