import _ from "lodash";
import validator from "validator";

import i18n from "../translations";
import { BaseErrorObject } from "./Login.constants";
import { IErrors, ILoginRequest, ILoginState, IOTPLoginRequest, ISendLoginCodeReq } from "./Login.interface";

export const isEmailValid = (applicantEmail: string): boolean => {
  return validator.isEmail(`${applicantEmail}`.trim());
};

export const isPhoneValid = (phone: string): boolean => {
  return (
    validator.isNumeric(phone) &&
    validator.isLength(phone, { max: 10, min: 10 })
  );
};

export const isPasswordValid = (password: string): boolean => {
  return validator.isStrongPassword(password, {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    returnScore: false
  });
};

export const getErrorsInLoginRequest = (loginData: ILoginRequest): IErrors => {

  let errors: IErrors = BaseErrorObject;

  const emailValid = isEmailValid(loginData.email);
  if (!emailValid) {
    errors = { ...errors, EMAIL: { status: true, messages: [i18n.t("EMAIL_ID_ERROR")] } };
  }

  const gstUsernameValid = isPasswordValid(loginData.password);
  if (!gstUsernameValid) {
    errors = { ...errors, PASSWORD: { status: true, messages: [i18n.t("PASSWORD_ERROR")] } };
  }

  return errors;
};

export const getErrorsInOTPGenerateRequest = (
  loginData: ISendLoginCodeReq
): IErrors => {
  let errors: IErrors = BaseErrorObject;

  const phoneValid = isPhoneValid(loginData.phone);
  if (!phoneValid) {
    errors = {
      ...errors,
      PHONE: { status: true, messages: [i18n.t("PHONE_INVALID")] },
    };
  }

  return errors;
};

export const getErrorsInOTPLoginRequest = (
  loginData: IOTPLoginRequest
): IErrors => {
  let errors: IErrors = BaseErrorObject;

  const phoneValid = isPhoneValid(loginData.phone);
  if (!phoneValid) {
    errors = {
      ...errors,
      PHONE: { status: true, messages: [i18n.t("PHONE_INVALID")] },
    };
  }

  const isOTPValid =
    validator.isNumeric(loginData.otp) &&
    validator.isLength(loginData.otp, { max: 6, min: 6 });
  if (!isOTPValid) {
    errors = {
      ...errors,
      OTP: { status: true, messages: [i18n.t("OTP_ERROR")] },
    };
  }

  return errors;
};

export const getLoginRequestObject = (loginData: ILoginState): ILoginRequest => {
  return {
    email: loginData.email,
    password: loginData.password
  };
};
