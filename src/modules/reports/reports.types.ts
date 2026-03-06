export type options = {
  label: string;
  value: number;
};

type vehicle = {
  label: string;
  value: string | number;
};

export interface reportForm {
  vehicle: vehicle;
  startDate: Date;
  endDate: Date;
}

export interface BasicFormProps {
  activeMobileForm: boolean;
  handleMobileFormActiveState: () => void;
  handleFormSubmit: (data: reportForm) => void;
}

export interface tableHeader {
  label: string;
}
