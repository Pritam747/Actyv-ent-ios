import {
  IonButton,
  IonCheckbox,
  IonCol,
  IonContent,
  IonGrid,
  IonImg,
  IonInput,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
  IonPage,
  IonRouterLink,
  IonRow,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import LoginFooter from "../components/LoginFooter";
import "./Page.css";

import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { CommonService } from "../services/Common.Service";
import { UserService } from "../services/User.Service";
import { Constants } from "../utils/constants";
import * as loginService from "../utils/Login/Login.api";
import { BaseErrorObject } from "../utils/Login/Login.constants";
import { IErrors, ILoginRequest } from "../utils/Login/Login.interface";
import { isEmailValid } from "../utils/Login/Login.utils";
import { setEnterpriseUrlRedux } from "../utils/slice/enterprise.slice";
import { store } from "../utils/slice/store";
import { useAppSelector } from "../utils/slice/hooks";
import { RememberMeInterface, selectRememberMeData, setRememberMeData } from "../utils/slice/remember.slice";
import { getEnterpriseUrl } from "../services/Login.Services";
import { signOut } from "../utils/libs/cognito";
import { setEmailIdRedux } from "../utils/slice/email.slice";

const Login: React.FC = () => {
  const { i18n, t } = useTranslation();
  const [passwordShown, setPasswordShown] = useState<boolean>(false);
  const history = useHistory();
  const { register, handleSubmit, getValues, reset } = useForm({
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<IErrors>();
  const [messageToDisplay, setMessageToDisplay] = useState("");
  const [forgotPasswordStatus, setForgotPasswordStatus] = useState("");

  const rememberMeData = useAppSelector(selectRememberMeData);

  const [rememberMe, setRememberMe] = useState(rememberMeData?.remember);

  useEffect(() => {
    if (rememberMeData?.remember) {
      reset({
        email: rememberMeData?.email,
        password: rememberMeData?.pass,
      });
    }
  }, []);

  useEffect(() => {
    if (messageToDisplay) toast.success(messageToDisplay);
  }, [messageToDisplay]);

  const isBtnDisabled = () => {
    return loading;
  };
  const login = async (data, error, isFirstLoading = true) => {
    let loginRequest: ILoginRequest = {
      email: data.email,
      password: data.password,
    };
    if (isFirstLoading) setLoading(true);
    let res = await loginService.login(loginRequest);
   
    if (res.statusCode === Constants.API_SUCCESS) {
      
      
      let enterpriseUrlRes = await getEnterpriseUrl();
      if(enterpriseUrlRes.status === Constants.API_FAIL){
        signOut(() => {
          setLoading(false);
          toast.error(t("UNAUTHORIZED"));
          setTimeout(()=>{
            window.location.reload()
          },1000)
        })
        return
      }
      if (res.statusCode === Constants.API_SUCCESS) {
        let enterpriseUrl = enterpriseUrlRes?.data?.enterprises[0]?.url;
        store.dispatch(setEnterpriseUrlRedux(enterpriseUrl));
        let resCurUser = await UserService.getCurrentUser();
        if (isFirstLoading) setLoading(false);

        if (resCurUser.status === Constants.API_SUCCESS) {
          toast.success(Constants.LOGIN_SUCCESS_MSG);
          setLoading(false);
          history.replace({ pathname: "/app/inbox-list" });
        } else {
          signOut(() => {
            setLoading(false);
            toast.error(t("ENTERPRISE_NAME_ERROR_1"));
            setTimeout(()=>{
              window.location.reload()
            },1000)
          })
          return
        }
      }
      if (rememberMe) {
        let obj: RememberMeInterface = {
          email: data.email,
          pass: data.password,
          remember: rememberMe,
        };
        store.dispatch(setRememberMeData(obj));
      } else {
        store.dispatch(setRememberMeData(null));
      }
    } else {
      let obj = {
        fileName: "Login.tsx",
        functionName: "login()",
        error: res.message,
      };
      setLoading(false);
      toast.error(res.message);
      CommonService.systemException(obj);
    }
    setLoading(false);
  };

  const onForgotPasswordClick = async () => {
    const emailValid = isEmailValid(getValues("email"));
    let errors: IErrors = BaseErrorObject;
    if (!emailValid) {
      errors = {
        ...errors,
        EMAIL: { status: true, messages: [t("EMAIL_ID_ERROR")] },
      };
      setErrors(errors);
    } else {
      let res = await loginService.sendCode({ email: getValues("email") });
      const { errors, statusCode, message } = res;
      switch (statusCode) {
        case "SUCCESS": {
          setErrors(BaseErrorObject);
          let successMsg = message ? message : i18n.t('FORGOT_PASSWORD_SUCCESSFUL');
					toast.success(successMsg);
          setForgotPasswordStatus("success");
          store.dispatch(setEmailIdRedux(getValues('email')));
          history.push({
            pathname: "/forgotPassword"
          });
          break;
        }

        case "ERROR": {
          setErrors(BaseErrorObject);
          let errorMsg = message ? message : i18n.t('SOMETHING_WENT_WRONG');
					toast.error(errorMsg);
          setForgotPasswordStatus("failed");
          break;
        }

        default: {
          setErrors(BaseErrorObject);
        }
      }
    }
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
                <p className="">{t("LOGIN_NOTE")}</p>
              </IonCol>
            </IonRow>
          </IonGrid>
        </section>
        {/* login section */}
        <Loader isloading={loading} />
        {!loading && (
          <section className="login-form-wrapper mb-22">
            <form onSubmit={handleSubmit(login)}>
              <IonGrid className="pb-0">
                <IonRow>
                  <IonCol className="pb-0">
                    <IonList className="pb-0">
                      <div className="mb-13">
                        <IonItem lines="none" className="input-item">
                          <IonInput
                            placeholder={t("EMAIL")}
                            {...register("email")}
                          ></IonInput>
                          <IonImg src="./img/mail.svg" alt="mail-icon"></IonImg>
                        </IonItem>
                        {errors &&
                          errors.EMAIL.status &&
                          errors.EMAIL.messages.map((message, index) => (
                            <div key={index} className="validationError">
                              {message}
                            </div>
                          ))}
                      </div>
                      <div className="mb-0">
                        <IonItem lines="none" className="input-item">
                          <IonInput
                            placeholder={t("ENTER_PASSWORD")}
                            type={passwordShown ? "text" : "password"}
                            {...register("password", {
                              required: { value: true, message: "" },
                            })}
                          ></IonInput>
                          {passwordShown ? (
                            <IonImg
                              src="./img/eye-show.svg"
                              alt="mail-icon"
                              onClick={() => {
                                setPasswordShown(!passwordShown);
                              }}
                            ></IonImg>
                          ) : (
                            <IonImg
                              src="./img/eye.svg"
                              alt="mail-icon"
                              onClick={() => {
                                setPasswordShown(!passwordShown);
                              }}
                            ></IonImg>
                          )}
                        </IonItem>
                        {errors &&
                          errors.PASSWORD.status &&
                          errors.PASSWORD.messages.map((message, index) => (
                            <div key={index} className="validationError">
                              {message}
                            </div>
                          ))}
                      </div>
                    </IonList>
                  </IonCol>
                </IonRow>
                <IonRow className="ion-align-items-center ion-justify-content-between">
                  <IonCol size="auto">
                    <IonItem lines="none">
                      <IonCheckbox
                        className="checkbox-custom"
                        slot="start"
                        checked={rememberMe}
                        onIonChange={({ detail: { checked } }) => {
                          setRememberMe(checked);
                        }}
                      ></IonCheckbox>
                      <IonLabel className="fs-11">{t("REMEMBER_ME")}</IonLabel>
                    </IonItem>
                  </IonCol>
                  <IonCol size="auto" className="">
                    <IonRouterLink
                      className="fw-600 fs-11 primary-color"
                      onClick={onForgotPasswordClick.bind(this)}
                    >
                      {passwordShown}
                      {t("FORGOT_PASSWORD")}
                    </IonRouterLink>
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
                      {t("LOGIN_UPPER")}
                    </IonButton>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </form>
          </section>
        )}
        {!loading && (
          <>
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
                    <IonRouterLink className="fs-11" routerLink="/Login-otp">
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
                        {t("LOGIN_WITH_OTP")}
                      </IonButton>
                    </IonRouterLink>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </section>
            <LoginFooter />
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Login;
