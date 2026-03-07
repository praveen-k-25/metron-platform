export type options = {
  label: string;
  value: number;
};

export type vehicle = {
  label: string;
  value: string;
};

export interface reportForm {
  vehicle: vehicle;
  startDate: Date;
  endDate: Date;
  page: number;
  rows: number;
}

export interface BasicFormProps {
  reportForm: any;
  activeMobileForm: boolean;
  handleMobileFormActiveState: () => void;
  handleFormSubmit: (data: any) => void;
}

export interface tableHeader {
  label: string;
}

export interface vehicleListResponse {
  success: boolean;
  message: string;
  data: vehicle[];
}

export interface tripReportData {
  vehicleName: string;
  startTrip: string;
  endTrip: string;
  startLocation: { lat: number; lng: number };
  endLocation: { lat: number; lng: number };
  duration: string;
}

export interface idleReportData {
  vehicleName: string;
  idleStart: string;
  idleEnd: string;
  location: [number, number];
  duration: string;
}

export interface inactiveReportData {
  vehicleName: string;
  inactiveStart: string;
  inactiveEnd: string;
  inactiveStartLocation: [number, number];
  inactiveEndLocation: [number, number];
  duration: string;
}
