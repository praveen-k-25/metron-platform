export type focusedVehicleType = vehicleData | null;

export interface vehicleData {
  id: string;
  timestamp: string;
  user: string;
  username: string;
  lat: number;
  lng: number;
  speed: number;
  status: number;
}

export interface vehicleCardProps {
  isOpen: boolean;
  theme: string;
  changeOpen: () => void;
  handleSelectedVehicle: (data: vehicleData | null) => void;
  focusedVehicle: vehicleData | null;
}

export interface maplayersProps {
  handleLayers: (layer: string) => void;
}

// ----- Vehicle Marker Types -----------------------------------------------

export interface VehicleMarkerProps {
  focusedVehicle: vehicleData;
  handleSelectedVehicle: (data: vehicleData | null) => void;
}

export type LatLngExpression = [number, number] | null;

// ----- Map recenter Types --------------------------------------------------

export interface mapCenterProps {
  vehicleStatus: vehicleData[];
  focusedVehicle: focusedVehicleType;
}
