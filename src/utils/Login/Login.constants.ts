import { IErrors } from "./Login.interface";

export const BaseErrorObject: IErrors = {
  EMAIL: { status: false, messages: [] },
  PASSWORD: { status: false, messages: [] },
  LOGIN: { status: false, messages: [] },
  FORGOTPASSWORD: { status: false, messages: [] },
  PHONE: { status: false, messages: [] },
  OTP: { status: false, messages: [] },
};
