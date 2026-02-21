import type { Dispatch, SetStateAction } from "react";

export interface loginComponentProps {
  accessPage: string;
}

export interface LoginFormRequest {
  email: string;
  password: string;
}

export interface loginFormResponse {
  success: boolean;
  message: string;
  status?: number;
  cause?: string | null;
  data: {
    username: string;
    email: string;
    id: string;
    vehicles: any[];
  };
}

export interface OtpPayload {
  email: string;
}

export interface forgotPasswordComponentProps {
  onClose: () => void;
  isOpen: boolean;
  email: string;
  resendOtp: () => void;
}

export interface resetPassword {
  email: string;
  newPassword: string;
  otp: number;
}

export interface registerComponentProps {
  accessPage: string;
  setAccessPage: Dispatch<SetStateAction<string>>;
}

export interface registerRequestForm extends LoginFormRequest {
  username: string;
  confirmPassword: string;
  otp: string;
}

export interface RegisterOtpProps {
  email: string;
  onClose: () => void;
  isOpen: boolean;
  userInfo: registerRequestForm;
  setAccessPage: Dispatch<SetStateAction<string>>;
  reset: any;
}
