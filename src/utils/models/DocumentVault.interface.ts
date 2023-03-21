export interface IErrorValue {
  status: boolean;
  messages: string[];
}

export interface IErrors {
  FILE: IErrorValue;
  UDYAM_NUMBER: IErrorValue;
}

export interface RouteParams {
  applicationId: string,
  businessPartnerId: string
}