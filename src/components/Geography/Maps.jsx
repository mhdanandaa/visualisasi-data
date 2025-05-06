import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoibWhkYW5hbmRhYSIsImEiOiJjbTN2ajdtdmkwdjY0Mm1vZWFtY2FnZWQzIn0.xANg_9pFGZPF_TxLiqxvFg";

const Maps = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const popUp = useRef(null);
  const [geoData, setGeoData] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const fetchData = async () => {
    try {
      const respone = await fetch("https://json.sthresearch.site/negara.GeoJson");
      if (!respone.ok)
        throw new Error(`HTTP error! status: ${respone.status}`);
      const data = await respone.json();
      setGeoData(data);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [110, 0],
      zoom: 3,
    });

    map.current.on("load", () => {
      setMapLoaded(true);
      fetchData();
    });
  }, []);

  useEffect(() => {
    if (mapLoaded && geoData && map.current) {
      if (map.current.getSource("countries")) {
        map.current.getSource("countries").setData(geoData);
      } else {
        map.current.addSource("countries", {
          type: "geojson",
          data: geoData,
        });

        map.current.addLayer({
          id: "country-fill",
          type: "fill",
          source: "countries",
          paint: {
            "fill-color": [
              "interpolate",
              ["linear"],
              ["get", "visitors"],
              0,
              "#A3EB68",
              500,
              "#FDE96C",
              1000,
              "#FE7979",
              1500,
              "#FE0F0F",
              2000,
              "#7F0000",
            ],
            "fill-opacity": 0.8,
            "fill-outline-color": "#FFFFFF",
          },
        });

        popUp.current = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
        });

        map.current.on("mousemove", "country-fill", (e) => {
          const { name, visitors } = e.features[0].properties;
          const coordinates = e.lngLat;

          popUp.current
            .setLngLat(coordinates)
            .setHTML(
              `<div class="p-2 bg-gray-200 rounded shadow-md border border-gray-300">
                <strong>${name}</strong><br/>Pengunjung: ${visitors}
              </div>`
            )
            .addTo(map.current);
        });

        map.current.on("mouseleave", "country-fill", () => {
          popUp.current.remove();
        });
      }
    }
  }, [mapLoaded, geoData]);
  return (
    <div className="relative w-full h-screen">
      <div ref={mapContainer} className="w-full h-full" />

      {/* ✅ Legend */}
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded shadow-md text-sm border border-gray-300">
        <h4 className="font-bold mb-2">Jumlah Pengunjung</h4>
        <div className="flex items-center mb-1">
          <div className="w-4 h-4 bg-[#A3EB68] mr-2"></div> 1 - 499
        </div>
        <div className="flex items-center mb-1">
          <div className="w-4 h-4 bg-[#FDE96C] mr-2"></div> 500 - 999
        </div>
        <div className="flex items-center mb-1">
          <div className="w-4 h-4 bg-[#FE7979] mr-2"></div> 1000 - 1499
        </div>
        <div className="flex items-center mb-1">
          <div className="w-4 h-4 bg-[#FE0F0F] mr-2"></div> 1500 - 1999
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-[#7F0000] mr-2"></div> 2000+
        </div>
      </div>
    </div>
  );
};

export default Maps;
