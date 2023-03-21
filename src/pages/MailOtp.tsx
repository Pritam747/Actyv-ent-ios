import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonImg,
  IonItem,
  IonPage,
  IonRouterLink,
  IonRow,
} from "@ionic/react";
import React from "react";
import LoginFooter from "../components/LoginFooter";
import "./Page.css";
import { useTranslation } from "react-i18next";

const MailOtp: React.FC = () => {
  const { t } = useTranslation();
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
                <h1 className="fs-24 fw-700 lh-34">{t("VERIFY_EMAIL")}</h1>
                <p className="">{t("VERIFICATION_CODE")}</p>
              </IonCol>
            </IonRow>
          </IonGrid>
        </section>

        <section>
          <IonRouterLink className="fs-11" routerLink="/app/business-partner">
            <IonButton className="button-expand" expand="block">
              {t("VERIFY")}
            </IonButton>
          </IonRouterLink>
        </section>

        <section className="signup-text">
          <IonGrid>
            <IonRow>
              <IonCol className="ion-text-right">
                <p className="fs-11 fw-400">
                  {t("DID_NOT_GET_CODE")}{" "}
                  <IonRouterLink className="primary-color fw-600">
                    {t("RESEND")}
                  </IonRouterLink>
                </p>
              </IonCol>
            </IonRow>
          </IonGrid>
        </section>

        <LoginFooter />
      </IonContent>
    </IonPage>
  );
};

export default MailOtp;
