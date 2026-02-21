import userTracker from "@/mqtt/ClientMQTT";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { LayersControl, MapContainer, Marker, TileLayer } from "react-leaflet";
import MapLayers from "../components/MapLayers";
import MapRecenter from "../components/MapRecenter";
import VehicleCard from "../components/VehicleCard";
import VehicleMarker from "../components/VehicleMarker";
import ZoomControl from "../components/ZoomControl";
import { selectAllVehicles, setMaps } from "../dashboard.slice";
import { vehicleData } from "../dashboard.types";

type focusedVehiclePolyline = [number, number][];
type focusedVehicleType = vehicleData | null;

const icon = (vehicle: vehicleData) =>
  L.divIcon({
    className: "plane-icon",
    html: `<div style="
      position: relative;
      display:flex;
      align-items:center;
      justify-content:center;
      border-radius:100%;   
      width:30px;
      height:30px;   
    ">
    <svg fill="${
      vehicle.status === 1
        ? "#0000FF"
        : vehicle.status === 2
          ? "#FFBB00"
          : "#5B5B5B"
    }" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 640 640">
      <path d="M128 252.6C128 148.4 214 64 320 64C426 64 512 148.4 512 252.6C512 371.9 391.8 514.9 341.6 569.4C329.8 582.2 310.1 582.2 298.3 569.4C248.1 514.9 127.9 371.9 127.9 252.6zM320 320C355.3 320 384 291.3 384 256C384 220.7 355.3 192 320 192C284.7 192 256 220.7 256 256C256 291.3 284.7 320 320 320z"/></svg>
    </div>`,
    iconSize: [30, 30],
    iconAnchor: [30 / 2, 30 / 2],
  });

const Dashboard = () => {
  const { BaseLayer } = LayersControl;
  const dispatch = useAppDispatch();
  const LoggedInUser = useAppSelector((state) => state.auth.user);
  const map = useAppSelector((state) => state.dashboard.map);
  const vehicleStatus = useAppSelector(selectAllVehicles) as vehicleData[];
  const mapRef = useRef<L.Map>(null);
  const polylineRef = useRef<L.Polyline>(null);
  const { theme } = useAppSelector((state) => state.auth);

  const [focusedVehicle, setFocusedVehicle] =
    useState<focusedVehicleType>(null);
  const [focusedPolyline, setFocusedPolyline] =
    useState<focusedVehiclePolyline>([]);

  // Vehicle Card States
  const [isVehicleCardOpen, setIsVehicleCardOpen] = useState(false);

  useEffect(() => {
    userTracker(LoggedInUser);
    setTimeout(() => {
      setIsVehicleCardOpen(true);
    }, 1000);
  }, []);

  /* useEffect(() => {
    if (!mapRef.current) return;

    // Initialize polyline once
    if (!polylineRef.current) {
      polylineRef.current = L.polyline([], {
        color: "blue",
        weight: 4,
        opacity: 1,
        lineCap: "round",
        smoothFactor: 5,
      }).addTo(mapRef.current);
    }

    // Only update when a vehicle is selected
    if (focusedVehicle) {
      focusedPolyline;
      const newPoint: [number, number] = [
        focusedVehicle.lat,
        focusedVehicle.lng,
      ];

      // Append point only if it's new (avoid duplicate redraws)
      setFocusedPolyline((prev) => {
        const last = prev[prev.length - 1];
        if (
          !last ||
          last[0] !== newPoint[0] ||
          last[1] !== newPoint[1] ||
          focusedVehicle.status === 3
        ) {
          polylineRef.current?.addLatLng(newPoint);
          return [...prev, newPoint];
        }
        return prev;
      });
    } else {
      // Reset when no vehicle selected
      polylineRef.current?.setLatLngs([]);
      setFocusedPolyline([]);
    }
  }, [focusedVehicle]); */

  useEffect(() => {
    if (focusedVehicle) {
      let vehicle = vehicleStatus.find(
        (item: vehicleData) => item.id === focusedVehicle.id,
      );

      if (vehicle) {
        setFocusedVehicle(vehicle);
      }
    }
  }, [vehicleStatus]);

  const handleSelectedVehicle = useCallback(
    (data: focusedVehicleType) => {
      if (data?.status === 0) return;
      setFocusedVehicle(data);
    },
    [setFocusedVehicle],
  );

  const handleLayers = useCallback(
    (layer: string) => dispatch(setMaps(layer)),
    [dispatch],
  );

  return (
    <div className="flex-1 h-full bg-(--background)">
      <div className="h-full w-full p-1 relative flex ">
        <VehicleCard
          isOpen={isVehicleCardOpen}
          theme={theme || "light"}
          changeOpen={() => setIsVehicleCardOpen(!isVehicleCardOpen)}
          handleSelectedVehicle={handleSelectedVehicle}
          focusedVehicle={focusedVehicle}
        />
        <MapContainer
          ref={mapRef}
          center={[11.037062, 77.036487]} //{[12.9716, 77.5946]}
          zoom={15}
          zoomControl={false}
          minZoom={3}
          maxZoom={18}
          scrollWheelZoom={true}
          attributionControl={false}
          className="h-full flex-1 rounded-md relative"
        >
          <LayersControl position="topright">
            <BaseLayer checked={map === "osm"} name="OSM">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            </BaseLayer>
            <BaseLayer checked={map === "hybrid"} name="Hybrid">
              <TileLayer
                url="http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
                subdomains={["mt0", "mt1", "mt2", "mt3"]}
              />
            </BaseLayer>
            <BaseLayer checked={map === "street"} name="Street">
              <TileLayer
                url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                subdomains={["mt0", "mt1", "mt2", "mt3"]}
              />
            </BaseLayer>
          </LayersControl>

          {focusedVehicle && focusedVehicle.status !== 0 ? (
            <VehicleMarker
              focusedVehicle={focusedVehicle}
              handleSelectedVehicle={handleSelectedVehicle}
            />
          ) : (
            vehicleStatus.map(
              (item: any) =>
                item.status !== 0 && (
                  <Marker
                    key={item.user}
                    position={[item.lat, item.lng]}
                    icon={icon(item)}
                    eventHandlers={{
                      click: () => {
                        !focusedVehicle
                          ? setFocusedVehicle(item)
                          : setFocusedVehicle(null);
                      },
                    }}
                  />
                ),
            )
          )}

          <ZoomControl />
          <MapLayers handleLayers={handleLayers} />

          <MapRecenter
            vehicleStatus={vehicleStatus}
            focusedVehicle={focusedVehicle}
          />
        </MapContainer>
      </div>
    </div>
  );
};

export default Dashboard;
