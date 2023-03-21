import axios from "axios";
import { t } from "i18next";
import { Constants } from "../utils/constants";

import { generateMobileLoginOTP, signInWithEmail, verifyMobileLoginOTP } from "../utils/libs/cognito";
import { BaseErrorObject } from "../utils/Login/Login.constants";

import { ILoginRequest, ILoginResponse, IOTPLoginRequest, ISendCodeReq, ISendCodeRes, ISendLoginCodeReq } from "../utils/Login/Login.interface";
import { CommonService } from "./Common.Service";

export async function login(userData: ILoginRequest): Promise<ILoginResponse> {
  try {
    const cognitoUserSession = await signInWithEmail(
      userData.email,
      userData.password
    );
    return {
      errors: BaseErrorObject,
      statusCode: Constants.API_SUCCESS,
      message: "",
      idToken: cognitoUserSession.getIdToken().getJwtToken(),
      accessToken: cognitoUserSession.getAccessToken().getJwtToken(),
    };
  } catch (err: any) {
    return {
      errors: {
        ...BaseErrorObject,
        LOGIN: {
          status: true,
          messages: [err.message],
        },
      },
      statusCode: "ERROR",
      message: err.message,
      idToken: "",
      accessToken: "",
    };
  }
}

export async function otpBasedLogin(
  userData: IOTPLoginRequest
): Promise<ILoginResponse> {
  try {
    const cognitoUserSession = await verifyMobileLoginOTP(
      userData.phone,
      userData.otp
    );
    return {
      errors: BaseErrorObject,
      statusCode: "SUCCESS",
      message: "",
      idToken: cognitoUserSession.getIdToken().getJwtToken(),
      accessToken: cognitoUserSession.getAccessToken().getJwtToken(),
    };
  } catch (err: any) {
    return {
      errors: {
        ...BaseErrorObject,
        LOGIN: {
          status: true,
          messages: ["Invalid OTP"],
        },
      },
      statusCode: "ERROR",
      message: "Invalid OTP",
      idToken: "",
      accessToken: "",
    };
  }
}

export async function sendCode(sendCodeData: ISendCodeReq): Promise<ISendCodeRes> {
  try {

    const url = new URL(`/${Constants.API_STRING}/user/forgotPassword`, process.env.REACT_APP_ACTYV_ADMIN_SVC_URL).toString();
    const { data } = await axios.post<ISendCodeRes>(url, sendCodeData);

    return {
      errors: BaseErrorObject,
      statusCode: 'SUCCESS',
      message: data.message,
    };

  } catch (err: any) {

    return {
      errors: {
        ...BaseErrorObject,
        FORGOTPASSWORD: {
          status: true,
          messages: [err.response.data.message]
        }

      },
      statusCode: 'ERROR',
      message: err.response.data.message,


    }

  }
}

export async function sendLoginCode(userData: ISendLoginCodeReq) {
  try {
    const data = await generateMobileLoginOTP(userData.phone);
    return { success: true, message: t("OTP_SENT_MSG"), data };
  } catch (err) {
    return { success: false, message: err?.message };
  }
}


export async function createNewPassword(data: any) {
  try {
    const url = `${process.env.REACT_APP_ACTYV_ADMIN_SVC_URL}${Constants.CREATE_PASSWORD}`;
    let dataObj = {
      type: 'post',
      url: url,
      data: {
        verificationCode: data?.verificationCode,
        email: data?.email,
        newPassword: data?.newPassword,
      }
    }
    return CommonService.fetchData(dataObj);
  } catch (e) {
    if (axios.isAxiosError(e)) {
      return {
        status: Constants.API_FAIL,
        message: e.message,
      };
    } else {
      return { status: Constants.API_FAIL, message: Constants.API_FAIL_MSG };
    }
  }
}

export async function getEnterpriseUrl() {
  try {
    const url = `${process.env.REACT_APP_ACTYV_ADMIN_SVC_URL}${Constants.GET_ENTERPRISE_URL_API}`;
    let dataObj = {
      type: 'get',
      url: url,
    }

    return CommonService.fetchData(dataObj);
  } catch (e) {
    if (axios.isAxiosError(e)) {
      return {
        status: Constants.API_FAIL,
        message: e.message,
      };
    } else {
      return { status: Constants.API_FAIL, message: Constants.API_FAIL_MSG };
    }
  }
}