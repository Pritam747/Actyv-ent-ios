import { IonCard, IonCardContent, IonCol, IonGrid, IonImg, IonItem, IonRow } from "@ionic/react";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
var customParseFormat = require("dayjs/plugin/customParseFormat");

dayjs.extend(customParseFormat);

export class EHRTabsService {
  static renderTabs = (obj: any) => {
    const { t } = useTranslation();
    let tabObj = obj?.tabObj;
    let constObj = obj?.constObj;
    return (
      <>
        {constObj.map((conObj) => {
          return (
            <>
              <IonCard className="primary-card no-shadow border-1 br-8">
                <IonCardContent className="py-0 primary-light-bg">
                  <IonItem lines="none" className="pl--0 item-transparent">
                    <IonImg src={`./img/${conObj.icon}`} class="mr-10"></IonImg>
                    <h4 className="fs-14 fw-600 blue-text">{conObj.name}</h4>
                  </IonItem>
                </IonCardContent>
                {!Array.isArray(tabObj)?
                <>
                {tabObj &&
                  Object.keys(tabObj).map((key: any) => {
                    if (conObj.key === key) {
                      return (
                        <>
                          {tabObj[key] &&
                            tabObj[key].map((val: any) => {
                              if (conObj.key === key) {
                                return (
                                  <>
                                    <div className="card-divider"></div>
                                    <IonCardContent className="py-0">
                                      <IonGrid>
                                        <IonRow className="bottom-line-grid">
                                          <IonCol size="12" className="pb-0">
                                            <p className="mb-0 fs-14 fw-600">
                                              {val?.title}
                                            </p>
                                          </IonCol>
                                          <IonCol>
                                            <p className="letter-spacing1 fs-12 fw-600 primary-color">
                                              {obj?.year1}
                                            </p>
                                            <h4 className="fs-14 fw-600 blue-text">
                                              {val?.year1}
                                            </h4>
                                          </IonCol>
                                          <IonCol className="ion-text-center">
                                            <p className="letter-spacing1 fs-12 fw-600 primary-color">
                                              {obj?.year2}
                                            </p>
                                            <h4 className="fs-14 fw-600 blue-text">
                                              {val?.year2}
                                            </h4>
                                          </IonCol>
                                          <IonCol className="ion-text-right">
                                            <p className="letter-spacing1 fs-12 fw-600 primary-color">
                                              {t("GROWTH1")}
                                            </p>
                                            <h4 className="fs-14 fw-600 blue-text d-flex ion-justify-content-end">
                                              {val?.growthPercentage}
                                            </h4>
                                          </IonCol>
                                        </IonRow>
                                      </IonGrid>
                                    </IonCardContent>
                                  </>
                                );
                              }
                            })}
                        </>
                      );
                    }
                  })}</>
                  :
                <>
                {tabObj &&
                  tabObj.map((val) => {
                    return (
                      <>
                        <div className="card-divider"></div>
                        <IonCardContent className="py-0">
                          <IonGrid>
                            <IonRow className="bottom-line-grid ion-justify-content-between">
                              <IonCol size="10" className="pb-0">
                                <p className="mb-0 fs-14 fw-400">{val.title}</p>
                              </IonCol>
                              <IonCol size="auto" className="ion-text-right">
                                <p className="letter-spacing1 fs-12 fw-600">
                                  {val.value}
                                </p>
                              </IonCol>
                            </IonRow>
                          </IonGrid>
                        </IonCardContent>
                      </>
                    );
                  })}</>
                }
              </IonCard>
            </>
          );
        })}
      </>
    );
  };  
}
