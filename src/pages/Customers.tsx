import {
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonGrid,
  IonImg,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonInput,
  IonItem,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonRouterLink,
  IonRow,
} from "@ionic/react";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";
import Loader from "../components/Loader";
import { CommonService } from "../services/Common.Service";
import { fetchCustomersList } from "../services/CustomersList.Service";
import { Constants } from "../utils/constants";
import "./Page.css";
import { displayDate } from "../utils/DateTimeUtils";
import { selectEnterpriseId } from "../utils/slice/user.slice";
import { useAppSelector } from "../utils/slice/hooks";
import { toast } from "react-toastify";
import _ from "lodash";

const Customer: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const currentEnterpriseId = useAppSelector<string>(selectEnterpriseId);
  const [delayedSearchText, setDelayedSearchText] = useState<string>("");
  const delayedQuery = useCallback(_.debounce(q => setDelayedSearchText(q), Constants.DEBOUNCE_TIME), []);
	const [allDataFetched, setAllDataFetched] = useState(false);

  useEffect(() => {
      fetchData();
  }, [delayedSearchText]);

  const fetchData = async (isFirstLoading = true) => {
    if (isFirstLoading) setLoading(true);
    let obj = {
      limit: Constants.ITEMS_PER_PAGE,
      enterpriseId: currentEnterpriseId,
      offset: 0,
      searchText: delayedSearchText,
    };
    setDataList([]);
    let res = await fetchCustomersList(obj);
    if (res?.data?.success) {
      let newItems = res.data.data.data ?? [];
      setDataList([...newItems]);
      if (isFirstLoading) setLoading(false);
    } else {
      let obj = {
        fileName: "Customers.tsx",
        functionName: "fetchData()",
        error: res.message,
      };
      setLoading(false);
      toast.error(res?.data?.message);
      CommonService.systemException(obj);
    }
    setLoading(false);
  };

  const loadMore = async (event) => {
		let offset = 0;
		if (_.size(dataList) > 0) {
			offset = _.size(dataList);
		}
		let obj = {
			limit: Constants.ITEMS_PER_PAGE,
      enterpriseId: currentEnterpriseId,
			offset: offset,
			searchText: delayedSearchText,
		};
		let res = await fetchCustomersList(obj);
		if (res.status === Constants.API_SUCCESS) {
			let newItems = [];
			newItems = res?.data?.data?.data ?? [];
			if (_.size(dataList) === 0) {
				setDataList([...newItems]);
			} else {
				setDataList([...dataList, ...newItems]);
			}
			const dataTilNow = [...dataList, ...newItems];
			if (_.size(dataTilNow) >= res?.data?.data?.documentCount) {
				setAllDataFetched(true);
			}
		} else if (res.status === Constants.API_FAIL) {
			let obj = {
				fileName: 'Customers.tsx',
				functionName: 'loadMore()',
				error: res.message,
			};
			CommonService.systemException(obj);
		}
		event.target.complete();
	};

  const onSearch = (value: any) => {
		delayedQuery(value.trim());
		setSearchText(value.trim());
	  };
	

  const doRefresh = async (event) => {
    setDataList([]);
    fetchData();
    event.target.complete();
  };

  return (
    <IonPage>
      <Header />
      <IonContent fullscreen>
          <IonGrid>
            <IonRow>
              <IonCol size="12">
								<IonItem lines="none" className="search-input">
										<IonInput
											className='fs-14 border'
											placeholder={t('SEARCH')}
											value={searchText}
											onIonChange={e => onSearch(e.detail.value!)}
										></IonInput>
								</IonItem>
              </IonCol>
            </IonRow>
          </IonGrid>
        <Loader isloading={loading} />
        {_.size(dataList) === 0 && !loading && (
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
        {_.size(dataList) !== 0 && !loading && (
          <IonGrid>
            <h4 className="ion-padding-horizontal fs-20 fw-700 dark">
              {t("CUSTOMERS")}
            </h4>
          </IonGrid>
        )}
        {dataList?.map((list) => {
          let param =
            list?.businessPartnerId + "?&bpName=" + list?.businessName;
          return (
            <IonRouterLink
              routerLink={`${Constants.ACTYV_SCORE_PATH}${param}`}
              key={list?.businessPartnerId}
            >
              <IonCard className="primary-card br-8">
                <IonCardContent className="card-content">
                  <IonRow className="ion-align-items-center">
                    <IonCol size="auto" className="pl-0 py-0">
                      <div className="profile-wrap">
                        <IonImg className="with-profile  d-none"></IonImg>
                        <h4 className="without-profile fs-22 fw-700">
                          {list?.businessName.charAt(0).toUpperCase()}
                        </h4>
                      </div>
                    </IonCol>
                    <IonCol size="5" className="pr-0 py-0">
                      <h3 className="fs-16 fw-600">{list?.businessName}</h3>
                    </IonCol>
                    <IonCol className="ion-align-self-start ion-text-right">
                      <p className="fs-10 fw-400">
                        {t("JOINED_ON1")}{displayDate(list?.createdAt)}
                      </p>
                    </IonCol>
                    <IonCol
                      className="px-0 py-0 d-flex ion-align-items-center"
                      size="auto"
                    >
                      <svg
                        width="7"
                        height="13"
                        viewBox="0 0 7 13"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M6.27593 5.73812C6.4634 5.94051 6.56872 6.21499 6.56872 6.50117C6.56872 6.78736 6.4634 7.06183 6.27593 7.26423L1.68293 12.2214C1.49664 12.4184 1.24583 12.5282 0.985 12.5267C0.724171 12.5253 0.4744 12.4129 0.289964 12.2138C0.105528 12.0147 0.00132999 11.7452 1.26439e-05 11.4637C-0.00130471 11.1822 0.100365 10.9115 0.282929 10.7104L4.18293 6.50117L0.282929 2.29195C0.100365 2.09089 -0.00130471 1.82019 1.26439e-05 1.53868C0.00132999 1.25718 0.105528 0.9876 0.289964 0.788541C0.4744 0.589481 0.724171 0.477021 0.985 0.4756C1.24583 0.474178 1.49664 0.583909 1.68293 0.780947L6.27593 5.73812V5.73812Z"
                          fill="#A7A7A7"
                        />
                      </svg>
                    </IonCol>
                  </IonRow>
                </IonCardContent>
              </IonCard>
            </IonRouterLink>
          );
        })}
        <IonRefresher
          slot="fixed"
          onIonRefresh={async (ev) => {
            await doRefresh(ev);
          }}
        >
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <IonInfiniteScroll
						onIonInfinite={async (ev) => {
							if (allDataFetched) {
								ev.target.complete();
							} else {
								await loadMore(ev);
							}
						}}
					>
						{!allDataFetched && (
							<IonInfiniteScrollContent></IonInfiniteScrollContent>
						)}
					</IonInfiniteScroll>
      </IonContent>
    </IonPage>
  );
};

export default Customer;
