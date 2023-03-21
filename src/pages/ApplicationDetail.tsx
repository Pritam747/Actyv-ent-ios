import { Field } from "@data-driven-forms/react-form-renderer";
import {
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonGrid,
  IonImg,
  IonItem,
  IonPage,
  IonRow,
  useIonModal
} from "@ionic/react";
import { OverlayEventDetail } from "@ionic/react/dist/types/components/react-component-lib/interfaces";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip
} from "chart.js";
import _ from "lodash";
import React, { useEffect, useRef, useState } from "react";
import "react-circular-progressbar/dist/styles.css";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import ActyvScoreSection from "../components/ActyvScoreSection";
import DecisionPanel from "../components/DecisionPanel";
import Header from "../components/Header";
import Loader from "../components/Loader";
import OverviewDetails from "../components/OverviewDetails";
import ZoomedModel from "../components/ZoomedModel";
import {
  fetchApplicationBusinessPartnerAndGstInfo,
  fetchApplicationDocumentRead,
  fetchApplicationDocumentsList,
  fetchApplicationHistory,
  fetchApplicationOverview
} from "../services/ApplicationDetail.Service";
import { CommonService } from "../services/Common.Service";
import { Constants } from "../utils/constants";
import { displayDateInMMMYY } from "../utils/DateTimeUtils";
import { IUser } from "../utils/interfaces/App.interface";
import { IAssignAction } from "../utils/models/ApplicationEnterpriseView.interface";
import { RouteParams } from "../utils/models/DocumentVault.interface";
import { setApplicationIdRedux } from "../utils/slice/application.slice";
import { setBusinessPartnerIdRedux } from "../utils/slice/businessPartner.slice";
import { useAppSelector } from "../utils/slice/hooks";
import { store } from "../utils/slice/store";
import { selectUserState } from "../utils/slice/user.slice";
import "./Page.css";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ApplicationDetails: React.FC = () => {
  let user = useAppSelector<IUser>(selectUserState);    
  const [applicationDetails, setApplicationDetails] = useState(null);
  const { t } = useTranslation();
  const accordionGroup = useRef<null | HTMLIonAccordionGroupElement>(null);
  const { applicationId } = useParams<RouteParams>();
  const [gstLoading, setGstLoading] = useState(false);

  const [overviewData, setOverviewData] = useState<any>();
  const [businessPartnerId, setBusinessPartnerId] = useState<any>();
  const [businessPartnerAndGstInfoData, setBusinessPartnerAndGstInfoData] = useState<any>();
  const [documentsData, setDocumentsData] = useState<any[]>([]);
  const [documentsLists, setDocumentsLists] = useState<any[]>([]);
  const [currentDocument, setCurrentDocument] = useState<any[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [histLoading, setHistLoading] = useState(false);
  const [isDecisionPending, setIsDecisionPending] = useState(false);
  const [actions, setActions] = useState<IAssignAction[]>([]);
  const [formKey, setFormKey] = useState<string>('');
  const [formConfig, setFormConfig] = useState<Field[]>([]);
  const [zoomedDocumentFile, setZoomedDocumentFile] = useState<any>();
  const [zoomedDocumentData, setZoomedDocumentData] = useState<any>();  
  let history = useHistory();
  
  const [zoomedModal, dismissZoomedModal] = useIonModal(ZoomedModel, {
    onDismiss: (data: string, role: string) => dismissZoomedModal(data, role),
    file: zoomedDocumentFile,
    data:zoomedDocumentData,    
  });

  const transformText = (input: string) =>
    _.startCase(_.toLower(_.join(_.split(input, "_"), " ")));

  const formatFileIdToName = (fileId: string) => {
    let documentType: string = _.split(fileId, "-").pop() || "";
    if (_.includes(documentType, "MISCELLANEOUS_DOCUMENT"))
      documentType = _.replace(documentType, "MISCELLANEOUS_DOCUMENT_", "");

    const transformedText = transformText(documentType);
    return _.join(
      _.map(_.split(transformedText, " "), (word) =>
        _.includes(Constants.docList, word) ? _.toUpper(word) : word
      ),
      " "
    );
  };

  useEffect(() => {
    fetchOverview();
    if (businessPartnerId) {
      store.dispatch(setBusinessPartnerIdRedux(businessPartnerId));
      fetchBusinessPartnerAndGstInfo();
    }
    if (!accordionGroup.current) {
      return;
    }

    accordionGroup.current.value = [""];
  }, [businessPartnerId]);

  useEffect(() => {
    if (documentsLists) {
      setCurrentDocument(
        CommonService.getDocumentsTabPanel(documentsLists[0], documentsData)
      );
    }
  }, [documentsLists]);

  useEffect(() => {
    if (documentsData) {
      setDocumentsLists(getDocumentsList());
    }
  }, [documentsData]);

  useEffect(() => {
    const roleIds = user.roles.map((role) => role.roleId);

    const currentUserAssignmentDetails = _.find(
      applicationDetails?.applicationStatus.assignTo,
      (e) =>
        (e.identifier === user.id || roleIds.includes(e.identifier)) &&
        e.resolutionStatus === "PENDING"
    );

    if (_.isEmpty(currentUserAssignmentDetails)) {
      setIsDecisionPending(false);
    } else {
      setIsDecisionPending(true);
      setFormKey(
        _.get(currentUserAssignmentDetails, "additionalData.formConfigKey", "")
      );
      setActions(
        _.get(
          currentUserAssignmentDetails,
          "additionalData.approverContext.actions",
          []
        )
      );
    }
  }, [user, applicationDetails]);
  // API Call for Overview Data
  const fetchOverview = async () => {
    setGstLoading(true);
    let obj = {
      applicationId: applicationId,
    };

    let res = await fetchApplicationOverview(obj);
    if (res.status === Constants.API_SUCCESS) {
      const newData = res?.data?.application;
      setApplicationDetails(newData);
      setOverviewData(newData);
      store.dispatch(setApplicationIdRedux(applicationId));
      setBusinessPartnerId(newData.businessPartnerId);
    } else if (res.status === Constants.API_FAIL) {
      let obj = {
        fileName: "InboxDetail.tsx",
        functionName: "fetchOverview()",
        error: res.message,
      };
      CommonService.systemException(obj);
    }
  };

  // API Call for Business partner info and GST info
  const fetchBusinessPartnerAndGstInfo = async () => {
    setGstLoading(true);
    let obj = {
      businessPartnerId: businessPartnerId,
      gstin: overviewData?.businessPartner?.gstin || "",
    };
    setBusinessPartnerAndGstInfoData({});

    let res = await fetchApplicationBusinessPartnerAndGstInfo(obj);
    if (res.status === Constants.API_SUCCESS) {
      const newData = res?.data;
      setBusinessPartnerAndGstInfoData(newData);
      setGstLoading(false);
    } else if (res.status === Constants.API_FAIL) {
      let obj = {
        fileName: "InboxDetail.tsx",
        functionName: "fetchBusinessPartnerAndGstInfo()",
        error: res.message,
      };
      CommonService.systemException(obj);
    }
    setGstLoading(false);
  };

  // API Call to fetch Documents Lists
  const fetchDocuments = async () => {
    setDocumentsLoading(true);
    let obj = {
      applicationId: applicationId,
    };
    setDocumentsData([]);
    let res = await fetchApplicationDocumentsList(obj);
    if (res.status === Constants.API_SUCCESS) {
      const docData = res?.data;
      setDocumentsData(docData);
      setDocumentsLoading(false);
    } else if (res.status === Constants.API_FAIL) {
      let obj = {
        fileName: "InboxDetail.tsx",
        functionName: "fetchDocuments()",
        error: res.message,
      };
      CommonService.systemException(obj);
    }
    setDocumentsLoading(false);
  };

  // API Call to fetch History Data
  const fetchHistory = async () => {
    setHistLoading(true);
    let obj = {
      applicationId: applicationId,
    };
    setHistoryData([]);

    let res = await fetchApplicationHistory(obj);
    if (res.status === Constants.API_SUCCESS) {
      const histData = res?.data;
      setHistoryData(histData);
      setHistLoading(false);
    } else if (res.status === Constants.API_FAIL) {
      let obj = {
        fileName: "InboxDetail.tsx",
        functionName: "fetchHistory()",
        error: res.message,
      };
      CommonService.systemException(obj);
    }

    setHistLoading(false);
  };

  // Get Lists of Documents we are getting from Data
  const getDocumentsList = () => {
    let documents = [];
    if (documentsData) {
      for (let i = 0; i < _.size(documentsData); i++) {
        if (
          !documents.includes(documentsData[i]?.documentType) &&
          _.size(Object.entries(documentsData[i])) >= 1
        ) {
          documents.push(documentsData[i]?.documentType);
        }
      }
    }
    documents = documents.sort();
    return documents;
  };

  const readDocument = async (file: any) => {
    let obj = {
      fileId: file.fileId,
    };

    let res = await fetchApplicationDocumentRead(obj);
    if (res.status === Constants.API_SUCCESS) {
      CommonService.readFilesPDF(res.data, file.fileType, file.fileId);
    }
  };
  

  const openZoomedModel = (file: any, data: any) => {
    setZoomedDocumentFile(file);
    setZoomedDocumentData(data);
    
    zoomedModal({
      cssClass: "zoom-modal",
      onWillDismiss: async (ev: CustomEvent<OverlayEventDetail>) => {

      }
    })
    
  };

  let propObj = {
    businessPartnerId: overviewData?.businessPartnerId,
    businessPartnerName: overviewData?.businessPartner?.businessName,
  };
  return (
    <IonPage>
      <Header />
      <IonContent fullscreen>
        <IonItem lines="none">
          <IonGrid className="pt-11 business-partner-header">
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
                    {overviewData &&
                      overviewData?.businessPartner?.businessName
                        .charAt(0)
                        .toUpperCase()}
                  </h4>
                </div>
              </IonCol>

              <IonCol size="" className="pr-0 py-0">
                <h3 className="fs-18 fw-700">
                  {overviewData && overviewData?.businessPartner?.businessName}
                </h3>
                <p className="my-4 fs-14 fw-400 dark">
                  {t("APPLICATION_TYPE")} :{" "}
                  <span className="fs-14 fw-600 dark">
                    {overviewData && overviewData?.type}
                  </span>
                </p>
                <p 
                className={`statusbox status-${
                  Constants.APP_STATUS.includes(overviewData?.applicationStatus?.status)
                    ? overviewData?.applicationStatus?.status.toLowerCase()
                    : 'progress' 
                } mw-100 fs-12 fw-600`}>
                  {overviewData &&
                    CommonService.statusToDisplayFormat(
                      overviewData?.applicationStatus?.status
                    )}
                </p>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonItem>

        <Tabs className="custom-tabs">
          {/* Tab header start */}
          <TabList className="">
            <Tab className="fs-14 react-tabs__tab">{t("OVERVIEW_TAB")}</Tab>
            <Tab
              onClick={() => {
                fetchDocuments();
              }}
              className="fs-14 react-tabs__tab"
            >
              {t("DOCUMENTS_TAB")}
            </Tab>
            <Tab className="fs-14 react-tabs__tab">{t("ACTYV_SCORE")}</Tab>
            <Tab className="fs-14 react-tabs__tab">{t("FIELDS_TAB")}</Tab>
            <Tab
              onClick={() => {
                fetchHistory();
              }}
              className="fs-14 react-tabs__tab"
            >
              {t("HISTORY_TAB")}
            </Tab>
          </TabList>
          {/* Tab header end */}

          {/* Tab content start */}

          {/* tab 1 start */}
          <TabPanel>
            {" "}
            {/* Tab 1 Documents start */}
            <Loader isloading={gstLoading} />
            {_.isEmpty(businessPartnerAndGstInfoData?.gstInfo) && !gstLoading && (
              <IonCard className="overflow-visible primary-card no-shadow border-1 br-8">
                <IonCardContent className="card-content">
                  <IonRow className="ion-align-items-center">
                    <IonCol>
                      <h5 className="fs-16 fw-600 ion-text-center">
                        {Constants.DATA_UNAVAILABLE_MSG}
                      </h5>
                    </IonCol>
                  </IonRow>
                </IonCardContent>
              </IonCard>
            )}
            {!_.isEmpty(businessPartnerAndGstInfoData?.gstInfo) && (
              <IonCard className="overflow-visible primary-card no-shadow border-1 br-8">
                <IonCardContent className="py-0">
                  <IonGrid>
                    <IonRow>
                      <IonCol>
                        <h3 className="fs-18 fw-700">{t("FIELDS_TAB")}</h3>
                      </IonCol>
                    </IonRow>

                    <IonRow>
                      <IonCol size="auto">
                        <div className="inbox-profile">
                          <IonImg src="./img/profile.svg"></IonImg>
                        </div>
                      </IonCol>

                      <IonCol>
                        <IonRow>
                          <IonCol>
                            <div>
                              <p className="fs-14 fw-400">
                                {t("LEGEL_NAME_OF_BUSSINESS")}
                              </p>
                              <p className="fs-14 fw-600">
                                {businessPartnerAndGstInfoData?.gstInfo?.lgnm}
                              </p>
                            </div>
                          </IonCol>
                        </IonRow>

                        <IonRow>
                          <IonCol size="auto" className="icon-small-fixed pl-0">
                            <IonImg src="./img/note-gray.svg"></IonImg>
                          </IonCol>
                          <IonCol>
                            <div>
                              <p className="fs-14 fw-400">
                                {t("TRADE_NAME")}
                              </p>
                              <p className="fs-14 fw-600">
                                {
                                  businessPartnerAndGstInfoData?.gstInfo
                                    ?.tradeNam
                                }
                              </p>
                            </div>
                          </IonCol>
                        </IonRow>

                        <IonRow>
                          <IonCol size="auto" className="icon-small-fixed pl-0">
                            <IonImg src="./img/check-gray.svg"></IonImg>
                          </IonCol>
                          <IonCol>
                            <div>
                              <p className="fs-14 fw-400">
                                {t("NATURE_OF_BUSINESS")}
                              </p>
                              <p className="fs-14 fw-600">
                                {businessPartnerAndGstInfoData?.gstInfo?.nba[0]}
                              </p>
                            </div>
                          </IonCol>
                        </IonRow>

                        <IonRow>
                          <IonCol size="auto" className="icon-small-fixed pl-0">
                            <IonImg src="./img/date-icon.svg"></IonImg>
                          </IonCol>
                          <IonCol>
                            <div>
                              <p className="fs-14 fw-400">
                                {t("DOR")}
                              </p>
                              <p className="fs-14 fw-600">
                                {businessPartnerAndGstInfoData?.gstInfo?.rgdt}
                              </p>
                            </div>
                          </IonCol>
                        </IonRow>

                        <IonRow>
                          <IonCol size="auto" className="icon-small-fixed pl-0">
                            <IonImg src="./img/note-gray.svg"></IonImg>
                          </IonCol>
                          <IonCol>
                            <div>
                              <p className="fs-14 fw-400">
                                {t("BUSINESS_CONSTITUTION")}
                              </p>
                              <p className="fs-14 fw-600">
                                {businessPartnerAndGstInfoData?.gstInfo?.ctb}
                              </p>
                            </div>
                          </IonCol>
                        </IonRow>

                        <IonRow>
                          <IonCol size="auto" className="icon-small-fixed pl-0">
                            <IonImg src="./img/abc-icon.svg"></IonImg>
                          </IonCol>
                          <IonCol>
                            <div>
                              <p className="fs-14 fw-400">
                                {t("GST_STATUS")}
                              </p>
                              <p className="fs-14 fw-600">
                                {businessPartnerAndGstInfoData?.gstInfo?.sts}
                              </p>
                            </div>
                          </IonCol>
                        </IonRow>
                        <IonRow>
                          <IonCol size="auto" className="icon-small-fixed pl-0">
                            <IonImg src="./img/address.svg"></IonImg>
                          </IonCol>
                          <IonCol>
                            <div>
                              <p className="fs-14 fw-400">{t("ADDRESS")}</p>
                              <p className="fs-14 fw-600">
                                {overviewData?.enterpriseLocation}
                              </p>
                            </div>
                          </IonCol>
                        </IonRow>
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </IonCardContent>
              </IonCard>
            )}
          </TabPanel>
          {/* tab 1 end */}

          {/* tab 2 start */}
          <TabPanel>
            <Loader isloading={documentsLoading} />
            {_.size(documentsLists) === 0 && !documentsLoading && (
              <IonCard className="overflow-visible primary-card no-shadow border-1 br-8">
                <IonCardContent className="card-content">
                  <IonRow className="ion-align-items-center">
                    <IonCol>
                      <h5 className="fs-16 fw-600 ion-text-center">
                        {Constants.DATA_UNAVAILABLE_MSG}
                      </h5>
                    </IonCol>
                  </IonRow>
                </IonCardContent>
              </IonCard>
            )}
          {_.size(documentsLists) !== 0 && !documentsLoading &&
            <Tabs className="custom-tabs1">
              <div>
                <TabList className="py-10 ws-nowrap overflow-tabs">
                  {documentsLists &&
                    documentsLists.map((docList) => {
                      return (
                        <Tab
                          className="fs-14 react-tabs__tab"
                          onClick={() => {
                            setCurrentDocument(
                              CommonService.getDocumentsTabPanel(
                                docList,
                                documentsData
                              )
                            );
                          }}
                          key={Math.random()}
                        >
                          {formatFileIdToName(
                            _.get(
                              Constants.nameMapping,
                              docList,
                              transformText(docList)
                            )
                          )}
                        </Tab>
                      );
                    })}
                </TabList>
              </div>

              {documentsLists &&
                documentsLists.map(() => {
                  return (
                    <TabPanel key={Math.random()}>
                      <IonCard className="acc-card no-shadow border-1">
                        <IonCardContent className="card-content">
                          <IonRow className="">
                            {currentDocument &&
                              currentDocument.map((data) => {
                                return _.isEmpty(data.files) ? (
                                  <IonCol size="6">
                                    <div className="border-round document-preview-wrapper">
                                      <div className="document-image bottom-line-grid d-flex ion-justify-content-center ion-align-items-center p-5">
                                        <h5 className="fs-16 fw-600 ion-text-center">
                                          {Constants.FILE_UNAVAILABLE_MSG}
                                        </h5>
                                      </div>
                                    </div>
                                  </IonCol>
                                ) : (
                                  <>
                                    {data.files.map((file) => {
                                      return (
                                        <IonCol size="6">
                                          <div className="border-round document-preview-wrapper">
                                            <div
                                              id={`open-modal${file?.fileId}`}
                                              className="document-image bottom-line-grid d-flex ion-justify-content-center ion-align-items-center p-5"
                                            >
                                              <IonImg
                                                className="inner-doc"
                                                src={
                                                  file.fileType !==
                                                  "application/pdf"
                                                    ? `${process.env.REACT_APP_API}${Constants.APPLICATION_DETAIL_DOCUMENT_READ}${file.fileId}`
                                                    : "./img/partner-img/pdf-icon.png"
                                                }
                                                onClick={() => {
                                                  data.data
                                                    ? openZoomedModel(
                                                        file,
                                                        data.data
                                                      )
                                                    : readDocument(file);
                                                }}
                                              ></IonImg>
                                            </div>
                                            <div className="mx-10 my-7 document-name">
                                              <h4 className="mb-0 fs-14 fw-600">
                                                {file.type !== "SELF"
                                                  ? file.type
                                                  : data.documentType}
                                              </h4>
                                              <p className="fs-12 fw-400 light">
                                                {data.documentNo
                                                  ? data.documentNo
                                                  : displayDateInMMMYY(
                                                      data.endDate
                                                    )}
                                              </p>
                                            </div>
                                          </div>
                                        </IonCol>
                                      );
                                    })}
                                  </>
                                );
                              })}
                          </IonRow>
                        </IonCardContent>
                      </IonCard>
                      
                    </TabPanel>
                  );
                })}
            </Tabs>
            }
          </TabPanel>
          {/* tab 2end */}

          {/* tab 3 start */}
          <TabPanel>
            {overviewData && <ActyvScoreSection data={propObj} />}
          </TabPanel>
          {/* tab 3 end */}

          <TabPanel>
            <OverviewDetails appId={applicationId} />
          </TabPanel>

          <TabPanel>
            <IonCard className="overflow-visible primary-card no-shadow border-1 br-8">
              <h4 className="ion-padding-horizontal fs-20 fw-700 dark pt-11">
                {t("APPLICATION_TIMELINE")}
              </h4>
              <IonGrid className="">
                <Loader isloading={histLoading} />
                {historyData &&
                  historyData.map((history) => {
                    return (
                      <>
                        <br />
                        <IonRow className="">
                          <IonCol size="auto" className="">
                            <div className="history-profile">
                              {history.identifierType === "USER" ? (
                                <IonCol size="auto" className="pl-0 py-0">
                                  <div className="profile-wrap profile-wrap-lg">
                                    <IonImg
                                      className="shadow-profile history-profile-inner"
                                      src="./img/history-profile.svg"
                                    ></IonImg>
                                  </div>
                                </IonCol>
                              ) : (
                                <IonCol size="auto" className="pl-0 py-0">
                                  <div className="profile-wrap profile-wrap-lg">
                                    <IonImg
                                      className="with-profile px-10"
                                      src="./img/setting.png"
                                    ></IonImg>
                                  </div>
                                </IonCol>
                              )}
                            </div>
                          </IonCol>
                          <IonCol className="">
                            {CommonService.historyTab(history)}
                          </IonCol>
                        </IonRow>
                      </>
                    );
                  })}
              </IonGrid>
            </IonCard>
          </TabPanel>

          {/* Tab content start */}
        </Tabs>
        {isDecisionPending && (
          <DecisionPanel
            actions={actions}
            applicationDetails={applicationDetails}
            applicationId={applicationId}
            formConfig={formConfig}
            formKey={formKey}
          />
        )}
      </IonContent>
    </IonPage>
  );
};

export default ApplicationDetails;
