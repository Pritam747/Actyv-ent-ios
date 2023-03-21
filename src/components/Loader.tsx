import { IonCol, IonGrid, IonRow, IonSpinner } from "@ionic/react";
import React from "react";
import { useTranslation } from "react-i18next";
interface ILoader {
  isloading: boolean;
}
const Loader: React.FC<ILoader> = ({ isloading }) => {
  const { t } = useTranslation();
  if (isloading)
    return (
      <IonGrid>
        {isloading}
        <IonRow>
          <IonCol className="ion-text-center">
            <IonSpinner
              color="success"
              justify-content-center
              align-items-center
              name="crescent"
            ></IonSpinner>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol className="ion-text-center">
            <h5 className="fs-15 fw-550 ion-text-center">
              {t("LOADER_WAITING_MSG")}
            </h5>
          </IonCol>
        </IonRow>
      </IonGrid>
    );
};
export default Loader;
