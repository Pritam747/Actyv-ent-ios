import axios from "axios";
import { t } from "i18next";
import { generateMobileLoginOTP, signInWithEmail, verifyMobileLoginOTP } from "../libs/cognito";

import { BaseErrorObject } from "./Login.constants";
import { ILoginRequest, ILoginResponse, IOTPLoginRequest, ISendCodeReq, ISendCodeRes, ISendLoginCodeReq } from "./Login.interface";

export async function login(userData: ILoginRequest): Promise<ILoginResponse> {
  try {
    const { data: username } = await axios.post(`${process.env.REACT_APP_ACTYV_ADMIN_SVC_URL}/api/user/get-username`, { email: userData.email });

    const cognitoUserSession = await signInWithEmail(
      username,
      userData.password
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
          messages: [t("ENTER_VALID_OTP")],
        },
      },
      statusCode: "ERROR",
      message: t("ENTER_VALID_OTP"),
      idToken: "",
      accessToken: "",
    };
  }
}

export async function sendCode(sendCodeData: ISendCodeReq): Promise<ISendCodeRes> {
  try {

    const url = new URL("/api/user/forgotPassword", process.env.REACT_APP_ACTYV_ADMIN_SVC_URL).toString();
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
    return { success: true, message: t("OTP_SENT_MSG") };
  }
}
