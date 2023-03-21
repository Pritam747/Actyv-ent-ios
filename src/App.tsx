import {
	IonApp,
	IonRouterOutlet,
	IonSplitPane,
	isPlatform,
	setupIonicReact,
	useIonAlert
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import Menu from "./components/Menu";
import "./services/Interceptor.Service";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/display.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
/* Theme variables */
import { App as CapacitorApp } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";
import { getPlatforms } from "@ionic/react";
import * as Sentry from "@sentry/capacitor";
import createMatcher from "feather-route-matcher";
import { Suspense, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import ToastContainers from "./components/ToastContainers";
import ActyvScore from "./pages/ActyvScore";
import AppInfo from "./pages/AppInfo";
import ApplicationDetails from "./pages/ApplicationDetail";
import ApplicationList from "./pages/ApplicationList";
import Customer from "./pages/Customers";
import EHRViewDetailsNew from "./pages/EHRViewDetailsNew";
import ForgotPassword from "./pages/ForgotPassword";
import InboxList from "./pages/InboxList";
import Login from "./pages/Login";
import LoginOtp from "./pages/LoginOtp";
import NotificationList from "./pages/NotificationList";
import VerifyOTP from "./pages/VerifyOtp";
import "./theme/style-partner.scss";
import "./theme/style.scss";
import "./theme/variables.css";
import { getCurrentUser, getSession } from "./utils/libs/cognito";
import { persistor, store } from "./utils/slice/store";
import "./utils/translations/index.ts";
import _ from "lodash";

declare var IRoot;

Sentry.init({
	dsn: process.env.REACT_APP_SENTRY_DSN_KEY,
	release: "anchor-app@iossentrytest",
	dist: "build",
});

setupIonicReact();


const AppInit: React.FC = () => {
	let history = useHistory();

	useEffect(() => {
		init();
	}, []);

	const isRootRoute = (url) => {
		if (!url) return null;
		let routeMatcher = createMatcher({
			"/login": "login",
			"/app/inbox-list": "inbox-list",
			"/app/application-list": "app-list",
		});

		let urlObj = new URL(url);
		const baseUrl = urlObj.origin;

		const slug = url.split(baseUrl).pop();
		return routeMatcher(slug);
	};

	const init = async () => {


		if (Capacitor.isNativePlatform()) {

			document.addEventListener('ionBackButton', (ev) => {
				// @ts-ignore
				ev.detail.register(10, (processNextHandler) => {

					// processNextHandler();
					let url = window.location.href
					let isMain = isRootRoute(url)
					if (isMain || _.size(history) === 1)
						CapacitorApp.exitApp();
					else {
						history.goBack()
					}
				});
			});
		}
		return null;
	}
	return null
};

const App: React.FC = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [presentAlert] = useIonAlert();
	const { t } = useTranslation();

	useEffect(() => {
		if (isPlatform("android") || isPlatform("ios")) {
			IRoot.isRooted(
				(data) => {
					// check data value against true NOT 1
					if (data && data === true) {
						presentAlert({
							cssClass: "alert-custom",
							header: t("DEVICE_ROOTED_HEADER"),
							message: t("DEVICE_ROOTED_MSG"),
							buttons: [
								{
									text: "OK",
									cssClass: "primary-color",
									handler: () => {
										CapacitorApp.exitApp();
									},
								},
							],
						});
					} else {
						init();
					}
				},
				(data) => {
					init();
				}
			);
		} else {
			init();
		}
		//execute below code on condition do not execute on web
		if (!getPlatforms().includes("desktop")) {
			StatusBar.setStyle({ style: Style.Light });
		}
	}, []);

	const isLoggedInUser = (): boolean => {
		const currentUser = getCurrentUser();
		return currentUser ? true : false;
	};

	const init = async () => {
		try {
			const userSession = await getSession();
			setIsLoggedIn(userSession.isValid());
		} catch (e) {
			setIsLoggedIn(false);
		}
	};

	const MiddleWareRoute = ({ component: Component, ...rest }) => {
		// Add your own authentication on the below line.
		return (
			<Route
				{...rest}
				render={(props) =>
					isLoggedInUser() ? (
						<Component {...props} />
					) : (
						<Redirect
							to={{ pathname: "/login", state: { from: props.location } }}
						/>
					)
				}
			/>
		);
	};

	return (
		<>
			<ToastContainers />
			<Suspense fallback={"Loading.."}>
				<Provider store={store}>
					<PersistGate loading={null} persistor={persistor}>
						<IonApp>
							<IonReactRouter>
								<AppInit></AppInit>
								<IonSplitPane contentId="main">
									<Menu />
									<IonRouterOutlet id="main">
										<Switch>
											<Route path="/" exact={true}>
												{!isLoggedInUser() ? (
													<Redirect to="/login" />
												) : (
													<Redirect
														to={{ pathname: "/app/application-list" }}
													/>
												)}
											</Route>
											<Route path="/login" exact={true}>
												<Login />
											</Route>
											<Route path="/ForgotPassword" exact={true}>
												<ForgotPassword />
											</Route>
											<Route path="/app/verify-otp/:mobile" exact={true}>
												<VerifyOTP />
											</Route>
											<Route path="/Login-otp" exact={true}>
												<LoginOtp />
											</Route>
											<Route path="/app-info" exact={true}>
												<AppInfo />
											</Route>
											<MiddleWareRoute
												path="/app/notification-list"
												exact={true}
												component={NotificationList}
											/>
											<MiddleWareRoute
												path="/app/inbox-list"
												exact={true}
												component={InboxList}
											/>
											<MiddleWareRoute
												path="/app/inbox-list/inbox-detail/:applicationId"
												exact={true}
												component={ApplicationDetails}
											/>
											<MiddleWareRoute
												path="/app/ehr-detail-new/:businessPartnerId"
												exact={true}
												component={EHRViewDetailsNew}
											/>
											<MiddleWareRoute
												path="/app/application-list"
												exact={true}
												component={ApplicationList}
											/>
											<MiddleWareRoute
												path="/app/customers"
												exact={true}
												component={Customer}
											/>
											<MiddleWareRoute
												path="/app/customers/actyv-score/:businessPartnerId"
												exact={true}
												component={ActyvScore}
											/>
										</Switch>
									</IonRouterOutlet>
								</IonSplitPane>
							</IonReactRouter>
						</IonApp>
					</PersistGate>
				</Provider>
			</Suspense>
		</>
	);
};

export default App;

