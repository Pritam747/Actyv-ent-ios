import {
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonGrid, IonImg,
  IonPage,
  IonRow
} from "@ionic/react";
import React from "react";
import NotificationHeader from "../components/NotificationHeader";
import { useTranslation } from "react-i18next";

const NotificationList: React.FC = () => {
  const { t } = useTranslation();
  return (
    <IonPage>
      <NotificationHeader />

      <IonContent className="white" fullscreen>
        <IonGrid>
          <IonCard className="bg-notify no-shadow br-8">
            <IonCardContent className="card-content">
              <IonRow className="ion-align-items-start">
                <IonCol size="auto" className="pl-0 py-0">
                  <div className="profile-wrap profile-wrap-lg">
                    <IonImg className="with-profile d-none"></IonImg>
                    <h4 className="without-profile fs-22 fw-700">{t('J')}</h4>
                  </div>
                </IonCol>
                <IonCol className="pr-0 py-0">
                  <h3 className="fs-16 fw-600">{t('MKM_DISTRIBUTORS')}</h3>
                  <p className="fs-12 fw-400">
                    {t('MKM_SIGNED_IN')}{" "}
                    <span className="fw-600">{t('GSTIN: 21AAFXI1726B1T7')}</span>
                  </p>
                  <p className="absolute-tr fs-10 fw-400">
                    Joined On : 24 Aug 2{t('02')}2
                  </p>
                </IonCol>
              </IonRow>
            </IonCardContent>
          </IonCard>

          <IonGrid className="py-0">
            <IonRow>
              <IonCol className="py-0">
                <div className="card-divider"></div>
              </IonCol>
            </IonRow>
          </IonGrid>

          <IonCard className="bg-notify no-shadow br-8">
            <IonCardContent className="card-content">
              <IonRow className="ion-align-items-start">
                <IonCol size="auto" className="pl-0 py-0">
                  <div className="profile-wrap profile-wrap-lg">
                    <IonImg className="with-profile  d-none"></IonImg>
                    <h4 className="without-profile fs-22 fw-700">{t('J')}</h4>
                  </div>
                </IonCol>
                <IonCol className="pr-0 py-0">
                  <h3 className="fs-16 fw-600">{t('MKM_DISTRIBUTORS')}</h3>
                  <p className="fs-12 fw-400">
                    {t('MKM_SIGNED_IN')}{" "}
                    <span className="fw-600">{t('GSTIN: 21AAFXI1726B1T7')}</span>
                  </p>
                  <p className="absolute-tr fs-10 fw-400">
                   {t('JOINED_ON')}
                  </p>
                </IonCol>
              </IonRow>
            </IonCardContent>
          </IonCard>

          <IonGrid className="py-0">
            <IonRow>
              <IonCol className="py-0">
                <div className="card-divider"></div>
              </IonCol>
            </IonRow>
          </IonGrid>

          <IonCard className="bg-notify no-shadow br-8">
            <IonCardContent className="card-content">
              <IonRow className="ion-align-items-start">
                <IonCol size="auto" className="pl-0 py-0">
                  <div className="profile-wrap profile-wrap-lg">
                    <IonImg className="with-profile  d-none"></IonImg>
                    <h4 className="without-profile fs-22 fw-700">{t('J')}</h4>
                  </div>
                </IonCol>
                <IonCol className="pr-0 py-0">
                  <h3 className="fs-16 fw-600">{t('MKM_DISTRIBUTORS')}</h3>
                  <p className="fs-12 fw-400">
                    {t('MKM_SIGNED_IN')}{" "}
                    <span className="fw-600">{t('GSTIN: 21AAFXI1726B1T7')}</span>
                  </p>
                  <p className="absolute-tr fs-10 fw-400">
                   {t('JOINED_ON')}
                  </p>
                </IonCol>
              </IonRow>
            </IonCardContent>
          </IonCard>

          <IonGrid className="py-0">
            <IonRow>
              <IonCol className="py-0">
                <div className="card-divider"></div>
              </IonCol>
            </IonRow>
          </IonGrid>

          <IonCard className="bg-notify no-shadow br-8">
            <IonCardContent className="card-content">
              <IonRow className="ion-align-items-start">
                <IonCol size="auto" className="pl-0 py-0">
                  <div className="profile-wrap profile-wrap-lg">
                    <IonImg className="with-profile  d-none"></IonImg>
                    <h4 className="without-profile fs-22 fw-700">{t('J')}</h4>
                  </div>
                </IonCol>
                <IonCol className="pr-0 py-0">
                  <h3 className="fs-16 fw-600">{t('MKM_DISTRIBUTORS')}</h3>
                  <p className="fs-12 fw-400">
                    {t('MKM_SIGNED_IN')}{" "}
                    <span className="fw-600">{t('GSTIN: 21AAFXI1726B1T7')}</span>
                  </p>
                  <p className="absolute-tr fs-10 fw-400">
                   {t('JOINED_ON')}
                  </p>
                </IonCol>
              </IonRow>
            </IonCardContent>
          </IonCard>

          <IonGrid className="py-0">
            <IonRow>
              <IonCol className="py-0">
                <div className="card-divider"></div>
              </IonCol>
            </IonRow>
          </IonGrid>

          <IonCard className="no-shadow br-8">
            <IonCardContent className="card-content">
              <IonRow className="ion-align-items-start">
                <IonCol size="auto" className="pl-0 py-0">
                  <div className="profile-wrap profile-wrap-lg">
                    <IonImg className="with-profile  d-none"></IonImg>
                    <h4 className="without-profile fs-22 fw-700">{t('J')}</h4>
                  </div>
                </IonCol>
                <IonCol className="pr-0 py-0">
                  <h3 className="fs-16 fw-600">{t('MKM_DISTRIBUTORS')}</h3>
                  <p className="fs-12 fw-400">
                    {t('MKM_SIGNED_IN')}{" "}
                    <span className="fw-600">{t('GSTIN: 21AAFXI1726B1T7')}</span>
                  </p>
                  <p className="absolute-tr fs-10 fw-400">
                   {t('JOINED_ON')}
                  </p>
                </IonCol>
              </IonRow>
            </IonCardContent>
          </IonCard>

          <IonGrid className="py-0">
            <IonRow>
              <IonCol className="py-0">
                <div className="card-divider"></div>
              </IonCol>
            </IonRow>
          </IonGrid>
          
          <IonCard className="no-shadow br-8">
            <IonCardContent className="card-content">
              <IonRow className="ion-align-items-start">
                <IonCol size="auto" className="pl-0 py-0">
                  <div className="profile-wrap profile-wrap-lg">
                    <IonImg className="with-profile  d-none"></IonImg>
                    <h4 className="without-profile fs-22 fw-700">J</h4>
                  </div>
                </IonCol>
                <IonCol className="pr-0 py-0">
                  <h3 className="fs-16 fw-600">{t('MKM_DISTRIBUTORS')}</h3>
                  <p className="fs-12 fw-400">
                    {t('MKM_SIGNED_IN')}{" "}
                    <span className="fw-600">{t('GSTIN: 21AAFXI1726B1T7')}</span>
                  </p>
                  <p className="absolute-tr fs-10 fw-400">
                   {t('JOINED_ON')}
                  </p>
                </IonCol>
              </IonRow>
            </IonCardContent>
          </IonCard>

          <IonGrid className="py-0">
            <IonRow>
              <IonCol className="py-0">
                <div className="card-divider"></div>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default NotificationList;
