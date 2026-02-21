import type { FC } from "react";
import plus from "@/assets/svgs/plus.svg";
import plusDark from "@/assets/svgs/plus-dark.svg";
import minus from "@/assets/svgs/minus.svg";
import minusDark from "@/assets/svgs/minus-dark.svg";
import { useMap } from "react-leaflet";
import { useAppSelector } from "@/store/hooks";

const ZoomControl: FC = () => {
  const { theme } = useAppSelector((state: any) => state.auth);
  const map = useMap();
  const handleZoomIn = () => map.zoomIn(1);
  const handleZoomOut = () => map.zoomOut(1);

  return (
    <div className="flex flex-col justify-center items-center gap-0.5 border border-(--border) bg-(--button) absolute top-12 right-2 z-999 rounded-md">
      <section className="cursor-pointer">
        <img
          onClick={handleZoomIn}
          src={theme === "dark" ? plusDark : plus}
          alt="Zoom in"
          className="w-6.5 p-1.5"
        />
      </section>
      <section className="w-3.75 border-t border-t-[#e2e1e1] dark:border-t-[#454545]"></section>
      <section className="cursor-pointer">
        <img
          onClick={handleZoomOut}
          src={theme === "dark" ? minusDark : minus}
          alt="Zoom out"
          className="w-6.5 p-1.5"
        />
      </section>
    </div>
  );
};

export default ZoomControl;
