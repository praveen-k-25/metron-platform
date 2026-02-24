import { useEffect, useMemo, useRef, useState, type FC } from "react";
import { useMap } from "react-leaflet";
import * as L from "leaflet";
import "leaflet.marker.slideto";
import { vehicleData } from "../dashboard.types";
import toast from "react-hot-toast";

interface VehicleMarkerProps {
  focusedVehicle: vehicleData;
  handleSelectedVehicle: (data: vehicleData | null) => void;
}

interface SlideMarker extends L.Marker {
  slideTo?: (
    latlng: L.LatLngExpression,
    options?: { duration?: number; keepAtCenter?: boolean },
  ) => void;
}

type LatLngExpression = [number, number] | null;

const VehicleMarker: FC<VehicleMarkerProps> = ({
  focusedVehicle,
  handleSelectedVehicle,
}) => {
  const map = useMap();
  const markerRef = useRef<SlideMarker | null>(null);
  const polylineRef = useRef<L.Polyline>(null);
  const previousMapPosition = useRef<LatLngExpression | null>(null);

  /* ------------ Zoom-based dynamic icon ------------*/
  const [zoomLevel, setZoomLevel] = useState(map.getZoom());
  const scale = Math.max(0.2, Math.min(1, (zoomLevel - 8) / 4));
  const size = 60 * scale;
  const isDotView = zoomLevel < 10;

  const icon = useMemo(() => {
    const color =
      focusedVehicle.status === 3
        ? "#0000FF"
        : focusedVehicle.status === 2
          ? "#FFBB00"
          : focusedVehicle.status === 1
            ? "#5B5B5B"
            : "#0b8700";

    return L.divIcon({
      className: "plane-icon",
      html: isDotView
        ? `<div style="
            width:${size}px;
            height:${size}px;
            border-radius:50%;
            background:${color};
            box-shadow:0 0 4px rgba(0,0,0,0.4);
          "></div>`
        : `<div style="
            display:flex;
            align-items:center;
            justify-content:center;
            width:${size}px;
            height:${size}px;
            border-radius:50%;
            background:${color}22;
          ">
            <svg fill="${color}" viewBox="0 0 256 256" width="24" height="24">
              <path d="M230.251,103.83008A15.76842,15.76842,0,0,1,218.96,118.8457l-76.55664,23.55567-23.55566,76.55468a15.76424,15.76424,0,0,1-15.01465,11.292c-.09863.00195-.19922.00293-.29785.00293a15.75666,15.75666,0,0,1-15.09961-10.76563L29.83105,50.18164A15.99955,15.99955,0,0,1,50.18457,29.82812L219.4873,88.43359A15.76429,15.76429,0,0,1,230.251,103.83008Z"/>
            </svg>
          </div>`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  }, [focusedVehicle.status, size, isDotView]);

  useEffect(() => {
    const handleZoom = () => setZoomLevel(map.getZoom());
    map.on("zoomend", handleZoom);
    return () => {
      map.off("zoomend", handleZoom);
    };
  }, [map]);

  /* --------  Create marker once ---------*/
  useEffect(() => {
    if (!focusedVehicle) return;

    // Create polyline once
    if (!polylineRef.current) {
      polylineRef.current = L.polyline([], {
        color: "blue",
        weight: 4,
        opacity: 1,
        lineCap: "round",
      }).addTo(map);
    }

    if (!markerRef.current) {
      markerRef.current = L.marker([focusedVehicle.lat, focusedVehicle.lng], {
        icon,
      })
        .addTo(map)
        .on("click", () => handleSelectedVehicle(null));
    }

    return () => {
      polylineRef.current?.remove();
      markerRef.current?.remove();

      polylineRef.current = null;
      markerRef.current = null;
      previousMapPosition.current = null;
    };
  }, [focusedVehicle.id]);

  /* -------------- Update icon if zoom/status changes --------------*/
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setIcon(icon);
    }
  }, [icon]);

  /* ------------- Smooth movement ----------*/
  useEffect(() => {
    if (!markerRef.current) return;

    if (!previousMapPosition.current) {
      previousMapPosition.current = [focusedVehicle.lat, focusedVehicle.lng];
      return;
    }

    const start = previousMapPosition.current;
    const end: [number, number] = [focusedVehicle.lat, focusedVehicle.lng];

    const duration = 5000; // same as update interval
    const startTime = performance.now();

    function animate(time: number) {
      const progress = Math.min((time - startTime) / duration, 1);

      const lat = start[0] + (end[0] - start[0]) * progress;
      const lng = start[1] + (end[1] - start[1]) * progress;

      markerRef.current?.setLatLng([lat, lng]);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        previousMapPosition.current = end;
      }
    }

    requestAnimationFrame(animate);
  }, [focusedVehicle.lat, focusedVehicle.lng]);

  return null; // no React Marker component
};

export default VehicleMarker;
