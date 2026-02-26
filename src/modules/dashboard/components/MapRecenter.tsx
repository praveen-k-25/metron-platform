import recenter_dark from "@/assets/svgs/recenter-dark.svg";
import recenter from "@/assets/svgs/recenter.svg";
import * as L from "leaflet";
import { useEffect, type FC } from "react";
import { useMap } from "react-leaflet";
import { useSelector } from "react-redux";
import { mapCenterProps, vehicleData } from "../dashboard.types";

const MapRecenter: FC<mapCenterProps> = (props) => {
  const map = useMap();
  const { theme } = useSelector((state: any) => state.auth);
  const { vehicleStatus, focusedVehicle } = props;

  const handleCenter = () => {
    if (vehicleStatus.length === 0) return;
    if (focusedVehicle) {
      const position: L.LatLngExpression = [
        focusedVehicle.lat,
        focusedVehicle.lng,
      ];

      // 🔥 Smart follow mode
      const bounds = map.getBounds();
      const northEast = bounds.getNorthEast();
      const southWest = bounds.getSouthWest();

      // Convert bounds to pixel space
      const nePoint = map.latLngToContainerPoint(northEast);
      const swPoint = map.latLngToContainerPoint(southWest);

      // Create margin (in pixels)
      const margin = 10;

      // Define safe zone in pixels
      const safeTopLeft = L.point(swPoint.x + margin, nePoint.y + margin);
      const safeBottomRight = L.point(nePoint.x - margin, swPoint.y - margin);

      // Convert marker to pixel
      const markerPoint = map.latLngToContainerPoint(position);

      // Check if marker is outside safe zone
      const insideSafeZone =
        markerPoint.x >= safeTopLeft.x &&
        markerPoint.x <= safeBottomRight.x &&
        markerPoint.y >= safeTopLeft.y &&
        markerPoint.y <= safeBottomRight.y;

      if (!insideSafeZone) {
        map.flyTo([focusedVehicle.lat, focusedVehicle.lng], 18, {
          animate: true,
          duration: 0.7,
        });
      }
      return;
    }

    const coords: L.LatLngExpression[] = vehicleStatus.map(
      (item: vehicleData) => [item.lat, item.lng],
    );
    const bounds = L.latLngBounds(coords);

    // prevent uncessary movements.
    if (!map.getBounds().contains(bounds)) {
      map.flyToBounds(bounds, {
        animate: true,
        duration: 1.0,
        maxZoom: 16,
      });
    }
  };

  useEffect(() => {
    handleCenter();
  }, [vehicleStatus]);

  return (
    <section className="bg-(--button) rounded-md p-0.75 cursor-pointer absolute top-28.75 right-3 z-999">
      <img
        onClick={handleCenter}
        src={theme === "dark" ? recenter_dark : recenter}
        alt=""
        className="w-4"
      />
    </section>
  );
};

export default MapRecenter;
