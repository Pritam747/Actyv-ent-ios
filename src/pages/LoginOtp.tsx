import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonImg,
  IonInput,
  IonItem,
  IonItemDivider,
  IonList,
  IonPage,
  IonRouterLink,
  IonRow,
  IonText
} from "@ionic/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import LoginFooter from "../components/LoginFooter";
import { CommonService } from "../services/Common.Service";
import { sendLoginCode } from "../services/Login.Services";
import { IErrors, ISendLoginCodeReq } from "../utils/Login/Login.interface";
import { getErrorsInOTPGenerateRequest } from "../utils/Login/Login.utils";
import "./Page.css";

const LoginOtp: React.FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<IErrors>();
  const isBtnDisabled = () => {
    return loading;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      phone: "",
    },
  });

  const sendOTP = async (data, error) => {
    let loginRequest: ISendLoginCodeReq = {
      phone: data.phone,
    };
    console.log("loginRequest", loginRequest.phone);
    const errors = getErrorsInOTPGenerateRequest(loginRequest);
    const isUserLoginpDataInvalid = Object.values(errors).some(
      (val) => val.status === true
    );
    if (isUserLoginpDataInvalid) {
      setError(errors);
      let obj = {
        fileName: "LoginOtp.tsx",
        functionName: "sendOTP()",
        error: errors.PHONE.messages,
      };
      CommonService.systemException(obj);
      toast.error(errors.PHONE.messages);
      setLoading(true);
    } else {
      let res = await sendLoginCode(loginRequest);
      if(res?.success){
        toast.success(res?.message);
        history.push({ pathname: "/app/verify-otp/" + data.phone })
      }else{
        toast.error(res?.message);
      }
    }
    setLoading(false);
  };

  return (
    <IonPage className="login-page">
      <IonContent className="white ion-padding">
        {/* Logo section */}
        <section className="logo">
          <IonItem lines="none" className="mb-40 mt-55">
            <IonImg className="mx-auto" src="./img/actyv-logo.svg"></IonImg>
          </IonItem>
        </section>

        <section className="login-text">
          <IonGrid>
            <IonRow>
              <IonCol>
                <h1 className="fs-24 fw-700 lh-34">{t("LOGIN")}</h1>
                <p className="">{t("LOGIN_NOTES")}</p>
              </IonCol>
            </IonRow>
          </IonGrid>
        </section>

        {/* login section */}
        <section className="login-form-wrapper mb-22">
          <form onSubmit={handleSubmit(sendOTP)}>
            <IonGrid className="pb-0">
              <IonRow>
                <IonCol className="pb-0">
                  <IonList className="pb-0">
                    <div className="mb-13">
                      <IonItem lines="none" className="input-item">
                        <IonInput
                          type="number"
                          placeholder={t("ENTER_MOBILE_NUMBER")}
                          {...register("phone", {
                          })}
                        ></IonInput>
                      </IonItem>
                      {error &&
                        error.PHONE.status &&
                        error.PHONE.messages.map((message, index) => (
                          <div key={index} className="validationError">
                            {message}
                          </div>
                        ))}
                      <p className="ml-5 mt-5">
                        {errors.phone && (
                          <IonText color="danger">
                            {t("PHONE_VALIDATION_ERROR")}
                          </IonText>
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
                    {t("CONTINUE_UPPER")}
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
          </form>
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

export default LoginOtp;
