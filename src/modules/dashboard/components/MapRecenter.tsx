import { useEffect, type FC } from "react";
import { useMap } from "react-leaflet";
import recenter from "@/assets/svgs/recenter.svg";
import recenter_dark from "@/assets/svgs/recenter-dark.svg";
import { useSelector } from "react-redux";

interface props {
  vehicleStatus: any;
  focusedVehicle: any;
}
let firstTime = 0;

const MapRecenter: FC<props> = (props) => {
  const { vehicleStatus, focusedVehicle } = props;
  const map = useMap();
  const { theme } = useSelector((state: any) => state.auth);

  const handleCenter = () => {
    if (focusedVehicle) {
      map.flyTo([focusedVehicle.lat, focusedVehicle.lng], 18, {
        animate: true,
        duration: 1.0,
      });
    } else {
      let data = vehicleStatus.map((item: any) => [item.lat, item.lng]);
      if (data.length > 0) {
        map.flyToBounds(data, {
          animate: true,
          duration: 1.0,
          maxZoom: 16,
        });
      }
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
