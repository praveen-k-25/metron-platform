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
