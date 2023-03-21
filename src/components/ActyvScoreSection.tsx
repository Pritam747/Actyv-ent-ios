import {
  IonAccordion,
  IonAccordionGroup,
  IonButton,
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonGrid,
  IonImg,
  IonItem,
  IonLabel,
  IonPopover,
  IonRouterLink,
  IonRow,
} from "@ionic/react";
import ChartDataLabels from "chartjs-plugin-datalabels";
import _ from "lodash";
import { useEffect, useRef, useState } from "react";
import { Bar } from "react-chartjs-2";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import {
  fetchApplicationActyvScoreNew,
  getFinOverviewData,
  // fetchData
} from "../services/ActyvScore.Service";
import { CommonService } from "../services/Common.Service";
import { Constants } from "../utils/constants";
import { setBusinessPartnerIdRedux } from "../utils/slice/businessPartner.slice";
import { store } from "../utils/slice/store";

const ActyvScore: React.FC<{
  data: {
    businessPartnerId: string;
    businessPartnerName: string;
  };
}> = (props) => {
  const { t } = useTranslation();
  const businessPartnerName = props?.data?.businessPartnerName;
  const businessPartnerId = props?.data?.businessPartnerId;
  const accordionGroup = useRef<null | HTMLIonAccordionGroupElement>(null);
  const popover = useRef<HTMLIonPopoverElement>(null);
  const [actyvScore, setActyvScore] = useState<any>();
  const [finOverviewData, setFinOverviewData] = useState<any>();
  const [actyvScoreBarLabels, setActyvScoreBarLabels] = useState<any>();
  const [actyvScoreBarDatas, setActyvScoreBarDatas] = useState<any>();
  const [actyvScoreLoading, setActyvScoreLoading] = useState(false);
  const [scorePopoverOpen, setScorePopoverOpen] = useState(false);
  let ehrUrl = process.env.REACT_APP_ACTYV_EHR_REPORT_URL;
  let param = businessPartnerId + "?&bpName=" + businessPartnerName;
  let chartData = [];
  let chartLabels = [];
  let scoreRangeLegend;

  const openScorePopover = (e: any) => {
    popover.current!.event = e;
    setScorePopoverOpen(true);
  };

  // const fetch = async() => {
  //   const response = await fetchData();
  //   scoreRangeLegend = response;
  //   console.log(scoreRangeLegend);
  //   //return response;
  // }

  useEffect(() => {
    if (businessPartnerId) {
      store.dispatch(setBusinessPartnerIdRedux(businessPartnerId));
      fetchActyvScore();
      // fetch();
      // console.log(scoreRangeLegend);
    }
    if (!accordionGroup.current) {
      return;
    }
    accordionGroup.current.value = [""];
  }, []);

  const barChartData = {
    labels: actyvScoreBarLabels && actyvScoreBarLabels,
    datasets: [
      {
        data: actyvScoreBarDatas && actyvScoreBarDatas,
        backgroundColor: Constants.CHART_BACKGROUND_COLOR,
        borderRadius: 5,
        label: "Danceability",
        datalabels: {
          formatter: function (value, context) {
            if (Number.isInteger(value)) {
              return value;
            } else {
              return value.toFixed(2);
            }
          },
          font: {
            size: 12,
            weight: 700,
          },
          padding: {
            top: 10,
          },
          color: "black",
        },
      },
    ],
  };

  const barOption = Constants.barOption;
  const fetchActyvScore = async () => {
    setActyvScoreLoading(true);
    let obj = {
      businessPartnerId: businessPartnerId,
    };

    let res = await fetchApplicationActyvScoreNew(obj);
    if (res.status === Constants.API_SUCCESS) {
      const score = res?.data;
      setActyvScore(score);
      score?.success ? loadChartData(score?.data) : toast.error(score?.message);
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

  const mapNameAndScore = (score: any, name: string, index: number) => {
    chartData[index] = score;
    chartLabels[index] = name;
  };

  const loadChartData = (scoreData) => {
    const scoreDetails = _.get(
      scoreData,
      "scoreDetails",
      Constants.ACTYV_SCORE_DEFAULT
    );
    _.forEach(_.entries(scoreDetails), ([key, value]) => {
      if (_.get(Constants.labelMapping, key)) {
        mapNameAndScore(
          value,
          _.get(Constants.labelMapping, key, ""),
          _.indexOf(_.keys(Constants.labelMapping), key)
        );
      }
    });
    setActyvScoreBarDatas(chartData);
    setActyvScoreBarLabels(chartLabels);
    setFinOverviewData(getFinOverviewData(scoreData));
  };

  return (
    <>
      <Loader isloading={actyvScoreLoading} />
      {!actyvScore?.success && !actyvScoreLoading && (
        <IonCard className="overflow-visible primary-card no-shadow border-1 br-8">
          <IonCardContent className="card-content">
            <IonRow className="ion-align-items-center">
              <IonCol>
                <h5 className="fs-16 fw-600 ion-text-center">
                  {t("REPORT_NOT_GENRATED")}
                </h5>
              </IonCol>
            </IonRow>
          </IonCardContent>
        </IonCard>
      )}
      {!actyvScoreLoading && actyvScore?.success && (
        <>
          <IonCard className="overflow-visible primary-card no-shadow border-1 br-8">
            <IonCardContent className="card-content">
              <IonRow className="ion-align-items-center">
                <IonCol size="auto">
                  <div className="progressbar">
                    <CircularProgressbar
                      value={actyvScore?.data?.scoreDetails?.actyvScore}
                      text={(actyvScore?.data?.scoreDetails?.actyvScore).toString()}
                      styles={buildStyles({
                        rotation: 0.6,
                        textSize: 30,
                        textColor: "#004A79",
                        pathColor: "rgba(0, 74, 121, 1)",
                      })}
                    />
                  </div>
                </IonCol>
                <IonCol className="score-text">
                  <div>
                    <h5 className="fs-16 fw-600">{t("ACTYV_SCORE")}</h5>
                    &nbsp;&nbsp;&nbsp;
                    <IonImg
                      onClick={openScorePopover}
                      className=""
                      style={{
                        position: "absolute",
                        width: "16px",
                        height: "16px",
                        left: "95px",
                        top: "10px",
                      }}
                      src="./img/i-sign.svg"
                    ></IonImg>
                    <IonPopover
                      ref={popover}
                      isOpen={scorePopoverOpen}
                      onDidDismiss={() => setScorePopoverOpen(false)}
                    >
                      {actyvScore?.data?.reportData?.scoreRangeLegend && <IonContent class="ion-padding">
                          <b>{'actyv Score Range:'}</b><br></br>
                          {actyvScore?.data?.reportData?.scoreRangeLegend.map(each => {
                            return (
              
                              [each.scoreRange, " : " ,each.legend,<br></br>] 
                            )
                            
                          })}
                      </IonContent> }

                      {!actyvScore?.data?.reportData?.scoreRangeLegend && <IonContent class="ion-padding">
                      <b>{'actyv Score Range:'}</b><br></br>
                      {'Greater than 80 : Excellent'}<br></br>
                      {'66 to 80 : Very Good'}<br></br>
                      {'51 to 65 : Good'}<br></br>
                      {'41 to 50 : Cautious'}<br></br>
                      {'Less than 40 : High risk'}<br></br>
                      </IonContent>}


                      {/* {!_.isEmpty(scoreRangeLegend) && scoreRangeLegend.map(each => {
                        return (
                          each.scoreLegend
                        )
                      })} */}
                      
                    </IonPopover>
                    <IonRow>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g filter="url(#filter0_d_1927_15440)">
                          <rect
                            x="4"
                            y="4"
                            width="12"
                            height="12"
                            rx="4"
                            fill={
                              CommonService.scoreRangeToTextAndColor(
                                actyvScore?.data?.scoreDetails?.actyvScore
                              ).color
                            }
                          />
                        </g>
                        <defs>
                          <filter
                            id="filter0_d_1927_15440"
                            x="0"
                            y="0"
                            width="20"
                            height="20"
                            filterUnits="userSpaceOnUse"
                            colorInterpolationFilters="sRGB"
                          >
                            <feFlood
                              floodOpacity="0"
                              result="BackgroundImageFix"
                            />
                            <feColorMatrix
                              in="SourceAlpha"
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                              result="hardAlpha"
                            />
                            <feOffset />
                            <feGaussianBlur stdDeviation="2" />
                            <feComposite in2="hardAlpha" operator="out" />
                            <feColorMatrix
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.16 0"
                            />
                            <feBlend
                              mode="normal"
                              in2="BackgroundImageFix"
                              result="effect1_dropShadow_1927_15440"
                            />
                            <feBlend
                              mode="normal"
                              in="SourceGraphic"
                              in2="effect1_dropShadow_1927_15440"
                              result="shape"
                            />
                          </filter>
                        </defs>
                      </svg>
                      <p>
                        {
                          CommonService.scoreRangeToTextAndColor(
                            actyvScore?.data?.scoreDetails?.actyvScore
                          ).text
                        }
                      </p>
                      {/* &nbsp;&nbsp;&nbsp;
                      <IonImg
                        onClick={openScorePopover}
                        className=""
                        style={{
                          position: "absolute",
                          width: "16px",
                          height: "16px",
                          left: "px",
                          top: "5px",
                        }}
                        src="./img/i-sign.svg"
                      ></IonImg>
                      <IonPopover
                        ref={popover}
                        isOpen={scorePopoverOpen}
                        onDidDismiss={() => setScorePopoverOpen(false)}
                      >
                        <IonContent class="ion-padding">
                          {`actyv Score Range:
                              >80:Excellent $
                              66-80: Very Good
                              51-65: Good
                              41-50: Cautious
                              <40: High risk`}
                        </IonContent>
                      </IonPopover> */}
                    </IonRow>
                  </div>
                </IonCol>
              </IonRow>
              <div className="card-head absolute-tr">
                <h4 className="fw-600 fs-12 hanging-text">
                  {t("OVERALL_ASSESSMENT")}
                </h4>
              </div>
            </IonCardContent>
            <div className="card-divider"></div>
            <IonCardContent className=" py-0">
              <IonRow className="ion-justify-content-between ion-align-items-center">
                <IonCol size="auto" className="">
                  <h4 className="fs-12 fw-600">
                    {t("ENTERPRISE_HEALTH_REPORT")}
                  </h4>
                </IonCol>
                <IonCol className="ion-text-right">
                  <IonButton
                    shape="round"
                    className="fs-10 fw-600 short-round-btn"
                    href={
                      actyvScore && ehrUrl + "=" + actyvScore?.data?.reportKey
                    }
                  >
                    <IonImg className="mr-6" src="./img/download.svg"></IonImg>
                    {t("DOWNLOAD")}
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonCardContent>
          </IonCard>

          <IonAccordionGroup ref={accordionGroup} multiple={true}>
            {/* first accordion start */}
            {actyvScore?.data?.reportType === "SILVER" &&
              !_.isEmpty(actyvScore?.data?.reportData) && (
                <IonCard className="acc-card no-shadow border-1">
                  <IonAccordion value="first">
                    <IonItem slot="header" lines="none">
                      <IonImg
                        src="./img/rating-circle.svg"
                        className="mr-12"
                      ></IonImg>
                      <IonLabel className="fw-600 fs-14">
                        {t("FINANCIAL_OVERVIEW")}
                      </IonLabel>
                    </IonItem>

                    <div className="p-relative pl-8 content-acc" slot="content">
                      {finOverviewData &&
                        finOverviewData.map((val) => {
                          return (
                            <>
                              <IonRow
                                className="bottom-line-grid ion-align-items-center"
                                key={Math.random()}
                              >
                                <IonCol size="auto">
                                  <IonImg src="./img/note.svg"></IonImg>
                                </IonCol>
                                <IonCol className="px-0 py-1">
                                  <IonGrid class="py-0 pr-2">
                                    <IonRow className="d-table ion-align-items-center">
                                      <IonCol
                                        size="7"
                                        className="va-middle d-tcell pl-0"
                                      >
                                        <div className="financial-detail">
                                          <p className="light table-text-details fs-12 fw-400">
                                            {val.key}
                                          </p>
                                        </div>
                                      </IonCol>
                                      <IonCol
                                        size="5"
                                        className="growth-detail va-middle d-tcell px-0"
                                      >
                                        <div className="growth-detail-inner">
                                          <IonRow className="ion-align-items-center">
                                            <IonCol>
                                              <p className="fw-600 fs-14 ion-text-right">
                                                {val.value}
                                              </p>
                                            </IonCol>
                                          </IonRow>
                                        </div>
                                      </IonCol>
                                    </IonRow>
                                  </IonGrid>
                                </IonCol>
                              </IonRow>
                            </>
                          );
                        })}
                    </div>
                  </IonAccordion>
                </IonCard>
              )}
            {/* first accordion end */}

            {/* second accordion start */}
            <IonCard className="acc-card no-shadow border-1">
              <IonAccordion value="second">
                <IonItem slot="header" lines="none">
                  <IonImg
                    src="./img/rating-circle.svg"
                    className="mr-12"
                  ></IonImg>
                  <IonLabel className="fw-600 fs-14">
                    {t("ENTERPRISE_HEALTH_REPORT")}
                  </IonLabel>
                </IonItem>

                <div
                  className="p-relative pl-8 EHR-height content-acc canvas-chart-wrap"
                  slot="content"
                >
                  <Bar
                    height={200}
                    options={barOption}
                    data={barChartData}
                    plugins={[ChartDataLabels]}
                  />
                  {actyvScore?.data?.reportType === "SILVER" &&
                    !_.isEmpty(actyvScore?.data?.reportData) && (
                      <div>
                        <IonRow className="ion-justify-content-end">
                          <IonCol size="auto">
                            <IonRouterLink>
                              <IonButton
                                className="ion-text-right fs-14 fw-600 button-link"
                                routerLink={`/app/ehr-detail-new/${param}`}
                                fill="clear"
                              >
                                {t("VIEW_DETAILS")}
                              </IonButton>
                            </IonRouterLink>
                          </IonCol>
                        </IonRow>
                      </div>
                    )}
                </div>
              </IonAccordion>
            </IonCard>
            {/* second accordion end */}
          </IonAccordionGroup>
        </>
      )}
    </>
  );
};

export default ActyvScore;
