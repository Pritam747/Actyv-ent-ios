import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonImg,
  IonInput,
  IonItem,
  IonList,
  IonPage,
  IonRouterLink,
  IonRow,
} from "@ionic/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";
import { toast } from "react-toastify";
import LoginFooter from "../components/LoginFooter";
import { createNewPassword } from "../services/Login.Services";
import { Constants } from "../utils/constants";
import "./Page.css";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../utils/slice/hooks";
import { selectEmailId } from "../utils/slice/email.slice";

const ForgotPassword: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [passwordShownNew, setPasswordShownNew] = useState<boolean>(false);
  const [passwordShown2Reinput, setPasswordShownReinput] =
    useState<boolean>(false);

  const history = useHistory();
  const { register, handleSubmit } = useForm({ mode: "onChange" });
  let email = useAppSelector<String>(selectEmailId);
  const createPassword = async (data) => {
    if (data.password === data.re_password) {
      fetchData(data);
    } else {
      toast.error(Constants.PASSWORD_NOT_MATCH_MSG);
    }
  };

  const fetchData = async (data: any, isFirstLoading = true) => {
    let obj = {
      email: email,
      newPassword: data.password,
      verificationCode: data.verification_code,
    };
    let res = await createNewPassword(obj);
    if (res.status === Constants.API_SUCCESS) {
      toast.success(
        t("FORGOT_PASS_SUFFIX").concat(`${email}`).concat(t("FORGOT_PASS_SUFFIX"))
     );
      if (isFirstLoading) setLoading(false);
      history.push({
        pathname: "/login",
      });
    } else{
      let errorMsg = res?.error?.response ? res?.error?.response?.data.message : t('SOMETHING_WENT_WRONG');
			toast.error(errorMsg);
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
                <h1 className="fs-24 fw-700 lh-34">{t("CREATE PASSWORD")}</h1>
                <p className="">{t("FORGET_PASSOWORD_NOTE")}</p>
              </IonCol>
            </IonRow>
          </IonGrid>
        </section>

        {/* login section */}
        <section className="login-form-wrapper mb-22">
          <form onSubmit={handleSubmit(createPassword)}>
            <IonGrid className="pb-0">
              <IonRow>
                <IonCol className="pb-0">
                  <IonList className="pb-0">
                    <IonItem lines="none" className="input-item mb-13">
                      <IonInput
                        placeholder={t("VERIFICATION CODE")}
                        {...register("verification_code")}
                      ></IonInput>
                    </IonItem>
                    <IonItem lines="none" className="input-item mb-13">
                      <IonInput
                        placeholder={t("NEW PASSWORD")}
                        type={passwordShownNew ? "text" : "password"}
                        {...register("password")}
                      ></IonInput>
                      {passwordShownNew ? (
                        <IonImg
                          src="./img/eye-show.svg"
                          onClick={() => {
                            setPasswordShownNew(!passwordShownNew);
                          }}
                        ></IonImg>
                      ) : (
                        <IonImg
                          src="./img/eye.svg"
                          onClick={() => {
                            setPasswordShownNew(!passwordShownNew);
                          }}
                        ></IonImg>
                      )}
                    </IonItem>
                    <IonItem lines="none" className="input-item mb-13">
                      <IonInput
                        placeholder={t("CONFIRM PASSWORD")}
                        type={passwordShown2Reinput ? "text" : "password"}
                        {...register("re_password")}
                      ></IonInput>
                      {passwordShown2Reinput ? (
                        <IonImg
                          src="./img/eye-show.svg"
                          onClick={() => {
                            setPasswordShownReinput(!passwordShown2Reinput);
                          }}
                        ></IonImg>
                      ) : (
                        <IonImg
                          src="./img/eye.svg"
                          onClick={() => {
                            setPasswordShownReinput(!passwordShown2Reinput);
                          }}
                        ></IonImg>
                      )}
                    </IonItem>
                  </IonList>
                </IonCol>
              </IonRow>

              <IonRow>
                <IonCol>
                  <IonRouterLink className="fs-11">
                    <IonButton
                      className="button-expand"
                      type="submit"
                      expand="block"
                    >
                      {t("CREATE PASSWORD_UPPER")}
                    </IonButton>
                  </IonRouterLink>
                </IonCol>
              </IonRow>
            </IonGrid>
          </form>
        </section>
        
        <LoginFooter />

      </IonContent>
    </IonPage>
  );
};

export default ForgotPassword;
