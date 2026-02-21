import apiRequest from "@/services/request.manager";
import {
  LoginFormRequest,
  loginFormResponse,
  OtpPayload,
  registerRequestForm,
  resetPassword,
} from "./auth.types";

export const handleUserLogin = (
  data: LoginFormRequest,
): Promise<loginFormResponse> => {
  return apiRequest("post", "/api/auth/login", data, false);
};

export const handleUserLogout = (): Promise<any> => {
  return apiRequest("get", "/api/auth/logout", null, false);
};

export const handleForgotPasswordOtp = (data: OtpPayload): Promise<any> => {
  return apiRequest("post", "/api/auth/forgotPasswordOtp", data, false);
};

export const handleResetPassword = (data: resetPassword): Promise<any> => {
  return apiRequest("post", "/api/auth/resetPassword", data, false);
};

export const handleRegisterOtp = (data: OtpPayload): Promise<any> => {
  return apiRequest("post", "/api/auth/registerOtp", data, false);
};

export const handleUserRegister = (data: registerRequestForm): Promise<any> => {
  return apiRequest("post", "/api/auth/register", data, false);
};
