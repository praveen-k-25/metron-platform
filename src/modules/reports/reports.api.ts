import apiRequest from "@/services/request.manager";
import { reportForm } from "./reports.types";

export const getVehicleList = (): Promise<any> => {
  return apiRequest("get", "/api/vehicle/allVehiclesList", null, false);
};

export const getTripReport = (data: reportForm): Promise<any> => {
  return apiRequest("post", "/api/report/tripReport", data, false);
};

export const getIdleReport = (data: reportForm): Promise<any> => {
  return apiRequest("post", "/api/report/idleReport", data, false);
};

export const getInactiveReport = (data: reportForm): Promise<any> => {
  return apiRequest("post", "/api/report/inactiveReport", data, false);
};
