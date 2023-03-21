import {
	IonCol,
	IonContent,
	IonFooter,
	IonGrid,
	IonImg,
	IonItem,
	IonLabel,
	IonList,
	IonListHeader,
	IonMenu,
	IonMenuToggle,
	IonRow,
	IonToolbar,
  } from "@ionic/react";
  import { useTranslation } from "react-i18next";
  
  import { useEffect, useState } from "react";
  import { useLocation } from "react-router-dom";
  import { CommonService } from "../services/Common.Service";
  import { signOut } from "../utils/libs/cognito";
  import { IAppPage } from "../utils/models/AppPage.interface";
  import Loader from "./Loader";
  import "./Menu.css";
  import createMatcher from "feather-route-matcher";
  import { selectUserState } from "../utils/slice/user.slice";
  import { useAppSelector } from "../utils/slice/hooks";
  import { IUser } from "../utils/interfaces/App.interface";
   
  const appPages: IAppPage[] = [
	{
	  title: "Inbox",
	  url: "/app/inbox-list",
	  custIcon: "./img/inbox.svg",
	},
	{
	  title: "All Applications",
	  url: "/app/application-list",
	  custIcon: "./img/business-list.png",
	},
	{
	  title: "actyv Score",
	  url: "/app/customers",
	  custIcon: "./img/score.svg",
	},
  ];

  const getUserRoles = (userObj:IUser) : string  => {

	   let userRolesArray : string[] = userObj.roles.map(role => role.roleName);

	   let userRoles : string = userRolesArray.join(', ');

	   return userRoles;
  }

  const Menu: React.FC = () => {
	const { t } = useTranslation();
	const location = useLocation();
	const [currentPath, setCurrentPath] = useState("");
	let userObj = useAppSelector<IUser>(selectUserState);
	let userName: string = userObj?.firstName + "_" + userObj?.lastName;
	let profileImg: string = userObj?.logo;
	let userRoles: string =   getUserRoles(userObj);   
	              
	const [loading, setLoading] = useState(false);
  
	useEffect(() => {
	  setCurrentPath(location.pathname);
	}, [location]);
  
	const handleLogout = () => {
	  setLoading(true);
	  signOut(() => {				
		window.location.href = "/login";
	  });
	  setLoading(false);
	};
  
	const isMenuDisabled = () => {
	  let routeMatcher = createMatcher({
		"/app/verify-otp/:mobile": "verify-otp",
		"/login": "login",
		"/Login-otp": "login-otp",
		"/forgotPassword": "forgotPassword",
	  });
  
	  if (routeMatcher(currentPath) != null) return true;
	  else return false;
	};
  
	return (
	  <IonMenu
		disabled={isMenuDisabled()}
		className="side-menu"
		contentId="main"
		type="overlay"
	  >
		{loading === false && (
		  <IonContent className="white px--0">
			<IonListHeader className="profile-head">
			  <IonGrid>
				<IonRow className="ion-align-items-center">
				  <IonCol size="auto">
					<div className="menu-profile-wrap">
					  <IonImg
						className="menu-profile-inner"
						src={profileImg}
					  ></IonImg>
					</div>
				  </IonCol>
				  <IonCol>
					<h4 className="white-heading fs-16 fw-600">
					  {CommonService.statusToDisplayFormat(userName)}
					</h4>
					<h6  className="white-heading fs-14 fw-800">
					  {userRoles}
					</h6>
				  </IonCol>
				  
				</IonRow>
			  </IonGrid>
			</IonListHeader>
  
			<IonList id="inbox-list" class="menu-list">
			  {appPages.map((appPage, index) => {
				return (
				  <IonMenuToggle key={index} autoHide={false}>
					<IonItem
					  className={
						location.pathname === appPage.url ? "selected" : ""
					  }
					  routerLink={appPage.url}
					  routerDirection="none"
					  lines="none"
					  detail={false}
					>
					  <IonImg
						className="menu-icons"
						src={appPage.custIcon}
						alt="Icon"
					  ></IonImg>
					  <IonLabel className="dark fs-14 fw-400">
						{appPage.title}
					  </IonLabel>
					</IonItem>
				  </IonMenuToggle>
				);
			  })}
			</IonList>
		  </IonContent>
		)}
		{loading === false && (
		  <IonFooter className="ion-no-border">
			<IonToolbar>
			  <div>
				<IonItem className="ion-align-items-start menu-footer">
				  <IonImg
					className="menu-icons mr-10"
					src="./img/partner-img/question.svg"
					alt="Icon"
				  ></IonImg>
				  <p className="fs-12 fw-400">
					{t("SUPPORT")}{" "}
					<a
					  href={process.env.REACT_APP_SUPPORT_URL}
					  className="footer-links"
					>
					  <span className="primary-color">{t("HERE")}!</span>
					</a>
				  </p>
				</IonItem>
				<IonMenuToggle autoHide={false}>
				  <IonItem
					className="logout-btn"
					routerLink="/app-info"
					lines="none"
					detail={false}
				  >
					<IonImg
					  className="mr-10 menu-icons"
					  src="./img/info.svg"
					  alt="Icon"
					></IonImg>
  
					<IonLabel className="dark fs-14 fw-400">
					  {t("APP_INFO")}
					</IonLabel>
				  </IonItem>
				</IonMenuToggle>
				<IonMenuToggle autoHide={false}>
				  <IonItem
					className="logout-btn"
					onClick={handleLogout}
					lines="none"
					detail={false}
				  >
					<IonImg
					  className="mr-10 menu-icons"
					  src="./img/logout.svg"
					  alt="Icon"
					></IonImg>
  
					<IonLabel className="dark fs-14 fw-400">
					  {t("LOG_OUT")}
					</IonLabel>
				  </IonItem>
				</IonMenuToggle>
			  </div>
			</IonToolbar>
		  </IonFooter>
		)}
		<Loader isloading={loading} />
	  </IonMenu>
	);
  };
  
  export default Menu;
  