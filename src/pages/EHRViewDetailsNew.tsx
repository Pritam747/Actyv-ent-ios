import {
  IonCol,
  IonContent,
  IonGrid,
  IonImg,
  IonItem,
  IonPage,
  IonRow,
} from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { toast } from "react-toastify";
import EHRTabsNew from "../components/EHRTabsNew";
import Header from "../components/Header";
import Loader from "../components/Loader";
import { fetchApplicationActyvScoreNew } from "../services/ActyvScore.Service";
import { CommonService } from "../services/Common.Service";
import { Constants } from "../utils/constants";
import { selectBusinessPartnerId } from "../utils/slice/businessPartner.slice";
import { useAppSelector } from "../utils/slice/hooks";

const EHRViewDetailsNew: React.FC = () => {
  const accordionGroup = useRef<null | HTMLIonAccordionGroupElement>(null);
  const [actyvScoreLoading, setActyvScoreLoading] = useState(false);
  const [actyvScore, setActyvScore] = useState<any>();
  const [dataList, setDataList] = useState([]);
  const { search } = useLocation();
  const businessPartnerName = new URLSearchParams(search).get("bpName");
  let history = useHistory();
  const businessPartnerId = useAppSelector<string>(selectBusinessPartnerId);

  useEffect(() => {
    if (!accordionGroup.current) {
      return;
    }
    accordionGroup.current.value = [""];
  }, []);

  useEffect(() => {
    fetchActyvScoreNew();
  }, []);

  // API call to fetch Actyv score data
  const fetchActyvScoreNew = async () => {
    setActyvScoreLoading(true);
    let obj = {
      businessPartnerId: businessPartnerId,
    };

    let res = await fetchApplicationActyvScoreNew(obj);
    if (res.status === Constants.API_SUCCESS) {
      const score = res?.data;
      setActyvScore(score);
      getTabsScore(score);
      setActyvScoreLoading(false);
    } else if (res?.status === Constants.API_FAIL) {
      let obj = {
        fileName: "ActyvScore.tsx",
        functionName: "fetchActyvScore()",
        error: res?.message,
      };
      setActyvScoreLoading(false);
      toast.error(res?.message);
      CommonService.systemException(obj);
    }
    setActyvScoreLoading(false);
  };

  const getTabsScore = async (obj) => {
    if (obj?.data?.scoreDetails) {
      let scoreDetails = obj?.data?.scoreDetails;
      let scoreDetailsKeys = Object.keys(scoreDetails);
      let scoreTabs = [];
      for (let tabList of Constants.NEW_EHR_TABS_LIST) {
        let obj = {
          name: "",
          key: "",
          value: "",
        };
        if (scoreDetailsKeys.includes(tabList.key)) {
          obj.name = tabList.name;
          obj.key = tabList.key;
          obj.value = Math.round(scoreDetails[tabList.key]).toString();
        }
        scoreTabs.push(obj);
      }
      setDataList(scoreTabs);
    }
  };
  return (
    <IonPage>
      <Header />
      <Loader isloading={actyvScoreLoading} />
      {actyvScoreLoading === false && (
        <IonContent fullscreen>
          <IonItem lines="none" className="bottom-line-grid">
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
          </IonItem>

          <Tabs className="custom-tabs1">
            <TabList className="mb-13 py-10 overflow-a ws-nowrap">
              {dataList &&
                dataList.map((obj) => (
                  <Tab
                    className="position-relative fw-600 fs-14 react-tabs__tab counter-tab"
                    key={obj.key}
                  >
                    {
                      Constants.NEW_EHR_TABS_LIST.find(tabObj => tabObj.key === obj?.key) 
                      ? Constants.NEW_EHR_TABS_LIST.find(tabObj => tabObj.key === obj?.key).name
                      : ""
                    }
                    <h4 className="custom-count-tab fs-14 fw-600">
                      {obj?.value}
                    </h4>
                  </Tab>
                ))}
            </TabList>
            {dataList &&
              dataList.map((obj) => (
                <TabPanel key={obj.key}>
                  <IonItem
                    lines="none"
                    className="py-10 item-transparent mb-0 mh--auto"
                  >
                    <h3 className="fs-20 fw-700">{obj.name}</h3>
                  </IonItem>
                  <div>
                    <EHRTabsNew data={obj} actyvScore={actyvScore} />
                  </div>
                </TabPanel>
              ))}
          </Tabs>
        </IonContent>
      )}
    </IonPage>
  );
};

export default EHRViewDetailsNew;
