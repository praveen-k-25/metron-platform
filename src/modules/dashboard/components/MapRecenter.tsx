import { useEffect, useState, type FC } from "react";
import { useMap } from "react-leaflet";
import recenter from "@/assets/svgs/recenter.svg";
import recenter_dark from "@/assets/svgs/recenter-dark.svg";
import { useSelector } from "react-redux";
import * as L from "leaflet";

interface props {
  vehicleStatus: any;
  focusedVehicle: any;
}
let firstTime = 0;

const MapRecenter: FC<props> = (props) => {
  const { vehicleStatus, focusedVehicle } = props;
  const map = useMap();
  const { theme } = useSelector((state: any) => state.auth);
  const [vehicleDataCache, setVehicleDataCache] = useState();

  const handleCenter = () => {
    if (vehicleStatus.length === 0) return;
    if (focusedVehicle) {
      map.flyTo([focusedVehicle.lat, focusedVehicle.lng], 18, {
        animate: true,
        duration: 1.0,
      });
      return;
    }

    const coords = vehicleStatus.map((item: any) => [item.lat, item.lng]);
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
  }, [focusedVehicle]);

  useEffect(() => {
    if (firstTime === 0) {
      handleCenter();
      firstTime++;
    }
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
