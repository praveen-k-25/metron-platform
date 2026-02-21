import apiRequest from "@/services/request.manager";

export const handleDashboardVehicles = (): Promise<any> => {
  return apiRequest("get", "/api/vehicle/dashboardVehicles", null, false);
};
