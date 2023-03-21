import {
  IonCol,
  IonContent,
  IonGrid,
  IonImg, IonPage, IonRow
} from "@ionic/react";
import React, { useEffect, useRef } from "react";
import { useHistory, useLocation, useParams } from "react-router";
import ActyvScoreSection from "../components/ActyvScoreSection";
import Header from "../components/Header";
import { RouteParams } from "../utils/models/DocumentVault.interface";
import { setBusinessPartnerIdRedux } from "../utils/slice/businessPartner.slice";
import { store } from "../utils/slice/store";
import "./Page.css";

const ActyvScore: React.FC = () => {
  let history = useHistory();
  const { search } = useLocation();
  const businessPartnerName = new URLSearchParams(search).get("bpName");
  const { businessPartnerId } = useParams<RouteParams>();
  const accordionGroup = useRef<null | HTMLIonAccordionGroupElement>(null);
  let propObj = {
    businessPartnerId: businessPartnerId,
    businessPartnerName: businessPartnerName
  }
  
  useEffect(() => {
    if (businessPartnerId) {
      store.dispatch(setBusinessPartnerIdRedux(businessPartnerId))            
    }
    if (!accordionGroup.current) {
      return;
    }
    accordionGroup.current.value = [""];
  }, []);

  return (
    <IonPage>
      <Header />
      <IonContent fullscreen>
        <IonGrid>
          <IonRow className="">
            <IonCol
              className="px-0 py-0 d-flex ion-align-items-center"
              size="auto"
              onClick={() => history.goBack()}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  width="24"
                  height="24"
                  transform="matrix(-1 0 0 1 24 0)"
                  fill="white"
                  fillOpacity="0.01"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9.00499 10.9951C8.81751 11.1826 8.7122 11.4369 8.7122 11.7021C8.7122 11.9672 8.81751 12.2215 9.00499 12.4091L13.598 17.0021C13.7843 17.1846 14.0351 17.2863 14.2959 17.285C14.5567 17.2837 14.8065 17.1795 14.991 16.995C15.1754 16.8106 15.2796 16.5608 15.2809 16.3C15.2822 16.0392 15.1805 15.7884 14.998 15.6021L11.098 11.7021L14.998 7.80207C15.1805 7.61578 15.2822 7.36497 15.2809 7.10414C15.2796 6.84331 15.1754 6.59354 14.991 6.4091C14.8065 6.22467 14.5567 6.12047 14.2959 6.11915C14.0351 6.11784 13.7843 6.21951 13.598 6.40207L9.00499 10.9951Z"
                  fill="#091E42"
                  fillOpacity="0.66"
                />
              </svg>
            </IonCol>
            <IonCol size="auto" className="pl-0 py-0">
              <div className="profile-wrap profile-wrap-lg">
                <IonImg className="with-profile  d-none"></IonImg>
                <h4 className="without-profile fs-22 fw-700">
                  {businessPartnerName &&
                    businessPartnerName.charAt(0).toUpperCase()}
                </h4>
              </div>
            </IonCol>

            <IonCol size="" className="pr-0 py-0">
              <h3 className="mt-15 fs-18 fw-700">
                {businessPartnerName && businessPartnerName}
              </h3>
            </IonCol>
          </IonRow>
        </IonGrid>
        <ActyvScoreSection data = { propObj } />
      </IonContent>
    </IonPage>
  );
};

export default ActyvScore;
