"use client";

import { useGetData } from "@/hooks/useGetData";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const OverviewMap = dynamic(() => import("@/components/view/OverviewMap"), {
  ssr: false, // 🚫 disable SSR để tránh lỗi window/document
});

export default function DashBoard() {
  const [coords, setCoords] = useState([]);
  const [locations, setLocations] = useState([]);
  const { data: dataz } = useGetData("/api/company", {});

  useEffect(() => {
    const data = dataz?.data?.data || [];
    if (data?.length) {
      const _locations = [],
        _coords = [];
      data.forEach((datum) => {
        if (datum.type === 1) {
          _locations.push({
            name: datum.name,
            tax: datum.tax,
            address: datum.address,
            ...datum.location,
          });
        } else if (datum.type === 2) {
          if (datum.coords?.length) {
            datum.coords.forEach((coord) => {
              _coords.push({
                name: datum.name,
                tax: datum.tax,
                address: datum.address,
                color: datum.color,
                coords: coord,
              });
            });
          }
        }
      });
      setLocations(_locations);
      setCoords(_coords);
    }
  }, [JSON.stringify(dataz)]);

  return <OverviewMap locations={locations} coords={coords} />;
}
