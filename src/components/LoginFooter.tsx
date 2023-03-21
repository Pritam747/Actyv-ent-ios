import { IonCol, IonGrid, IonRow, IonText } from "@ionic/react";
import { useTranslation } from "react-i18next";

const LoginFooter: React.FC = () => {
  const { t } = useTranslation();
  const today = new Date();
  const year = today.getFullYear();

  return (
    <section className="login-footer">
      <IonGrid>
        <IonRow class="ion-justify-content-center">
          <IonCol size="10">
            <IonRow className="ion-justify-content-between">
              <IonCol size="auto" className="pb-0">
                <IonText className="fs-10 fw-600 primary-color">
                  <a
                    href={process.env.REACT_APP_HELP_URL}
                    className="footer-links"
                    target="_blank"
                  >
                    {t("HELP")}
                  </a>
                </IonText>
              </IonCol>
              <IonCol size="auto" className="pb-0">
                <IonText className="fs-10 fw-600 primary-color">
                  <a
                    href={process.env.REACT_APP_GRIEVANCE_URL}
                    className="footer-links"
                    target="_blank"
                  >
                    {t("GRIEVANCE_ADDRESSAL")}
                  </a>
                </IonText>
              </IonCol>
            </IonRow>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <h6 className="ion-text-center fs-10 fw-300">
              © {year}, {t("COPYRIGHT_TEXT")}
            </h6>
          </IonCol>
        </IonRow>
      </IonGrid>
    </section>
  );
};

export default LoginFooter;
