import {
  IonButton, IonCol, IonContent, IonGrid, IonImg, IonInput, IonItem, IonItemDivider, IonList, IonPage, IonRouterLink, IonRow, IonText
} from "@ionic/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import LoginFooter from "../components/LoginFooter";
import { CommonService } from '../services/Common.Service';
import { UserService } from "../services/User.Service";
import { Constants } from "../utils/constants";
import * as loginService from "../utils/Login/Login.api";
import { useTranslation } from "react-i18next";
import {
  IOTPLoginRequest,
  ISendLoginCodeReq
} from "../utils/Login/Login.interface";
import "./Page.css";
import { toast } from "react-toastify";
import { getEnterpriseUrl } from "../services/Login.Services";
import { store } from '../utils/slice/store';
import { setEnterpriseUrlRedux } from "../utils/slice/enterprise.slice";

const VerifyOTP: React.FC = () => {
  const { t } = useTranslation();
  const { mobile } = useParams<{ mobile: string }>();
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    resetField,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      otp: "",
    },
  });
  const isBtnDisabled = () => {
    return loading;
  };
  
  const verifyOTPAndLogin = async (data, error) => {
    let obj: IOTPLoginRequest = {
      phone: mobile,
      otp: data.otp,
    };

    setLoading(true);
    let res = await loginService.otpBasedLogin(obj);
    if (res.statusCode === Constants.API_SUCCESS) {
      let enterpriseUrlRes = await getEnterpriseUrl();
      if (res.statusCode === Constants.API_SUCCESS) {
        let enterpriseUrl = enterpriseUrlRes?.data?.enterprises[0]?.url;
        store.dispatch(setEnterpriseUrlRedux(enterpriseUrl));
        let resCurUser: any = await UserService.getCurrentUser();
        if (resCurUser.status === Constants.API_SUCCESS){
          toast.success(Constants.LOGIN_SUCCESS_MSG);
          history.push({ pathname: "/app/inbox-list" });
        }else {
        setLoading(false);
        toast.error(resCurUser?.message);
        }
      }else{
        setLoading(false);
        toast.error(res.message);
      }
      setLoading(false);
    } else {
      let obj = {
        fileName: "VerifyOtp.tsx",
        functionName: "verifyOTPAndLogin()",
        error: res.message,
      };
      toast.error(res.message);
      CommonService.systemException(obj);
      setLoading(false);
    }
  };
  const sendOTP = async () => {
    resetField("otp");
    let loginRequest: ISendLoginCodeReq = {
      phone: mobile,
    };
    setLoading(true);

    let res = await loginService.sendLoginCode(loginRequest);
    if (res.success) {
      toast.success(Constants.OTP_SENT_SUCCESS_MSG);
      setLoading(false);
    } else {
      let obj = {
        fileName: "VerifyOtp.tsx",
        functionName: "sendOTP()",
        error: res.message,
      };
      CommonService.systemException(obj);
      toast.error(res.message);
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <IonPage className="login-page">
      <IonContent className="white ion-padding">
        <section className="logo">
          <IonItem lines="none" className="mb-40 mt-55">
            <IonImg className="mx-auto" src="./img/actyv-logo.svg"></IonImg>
          </IonItem>
        </section>
        <form onSubmit={handleSubmit(verifyOTPAndLogin)}>
          <section className="login-text">
            <IonGrid>
              <IonRow>
                <IonCol className="pb-0">
                  <h1 className="fs-24 fw-700 lh-34">{t('ENTER_OTP')}</h1>
                  <p className="fw-400 fs-14">
                  {t("PLEASE_ENTER_OTP_SENT_TO")}
                    <span className="fw-400 fs-14"> {mobile}</span> 
                  </p>
                  <IonList className="pb-0">
                    <div className="mb-13">
                      <IonItem lines="none" className="input-item">
                        <IonInput type="number"
                          placeholder={t("ENTER_OTP")}
                          {...register("otp", {
                            required: { value: true, message: "" },
                          })}
                        ></IonInput>
                      </IonItem>
                      <p className="mb-0 ml-5 mt-5">
                        {errors.otp && (
                          <IonText color="danger">{t('ENTER_VALID_OTP')}</IonText>
                        )}
                      </p>
                    </div>
                  </IonList>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <IonButton
                    disabled={isBtnDisabled()}
                    type="submit"
                    className="button-expand fs-12 fw-600"
                    expand="block"
                  >
                     {t("VERIFY_UPPER")}
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
          </section>
        </form>
        <section className="signup-text">
          <IonGrid>
            <IonRow>
              <IonCol className="ion-text-right">
                <p className="fs-11 fw-400">
                {t("DID_NOT_GET_OTP")}
                  <IonRouterLink
                    className="primary-color fw-600"
                    onClick={() => {
                      sendOTP();
                    }}
                  >
                   {t("RESEND_OTP")}
                  </IonRouterLink>
                </p>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol className="ion-text-right">
                <p className="fs-11 fw-400">
                  <IonRouterLink
                    className="primary-color fw-600"
                    routerLink="/Login-otp"
                  >
                    {t('TRY_DIFFRENT_NUMBER')}
                  </IonRouterLink>
                </p>
              </IonCol>
            </IonRow>
          </IonGrid>
        </section>
        <IonGrid class="mb-22">
          <IonRow>
            <IonCol>
              <IonItemDivider className="divider mh-auto">
                <p className="divider-text fs-11">{t("OR")}</p>
              </IonItemDivider>
            </IonCol>
          </IonRow>
        </IonGrid>
        <section>
          <IonGrid>
            <IonRow>
              <IonCol className="ion-text-center">
                <IonRouterLink className="fs-11" routerLink="/login">
                  <IonButton
                    expand="block"
                    className="button-outline  fs-12 fw-600"
                    fill="outline"
                  >
                    <IonImg
                      class="icon-space"
                      src="./img/buttons.svg"
                      alt="mail-icon"
                    ></IonImg>
                    {t("LOGIN_WITH_PWD")}
                  </IonButton>
                </IonRouterLink>
              </IonCol>
            </IonRow>
          </IonGrid>
        </section>
        <LoginFooter />

      </IonContent>
    </IonPage>
  );
};

export default VerifyOTP;
