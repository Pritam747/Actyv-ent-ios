import {
  IonButtons,
  IonHeader,
  IonImg,
  IonItem,
  IonMenuButton,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React from "react";
import { IUser } from "../utils/interfaces/App.interface";
import { useAppSelector } from "../utils/slice/hooks";
import { selectUserState } from "../utils/slice/user.slice";

const Header: React.FC = () => {
  let userObj = useAppSelector<IUser>(selectUserState);
  let profileImg: string = userObj?.logo;
  return (
    <IonHeader className="menu-header ion-no-border">
      <IonToolbar className="native-white-bg">
        <IonButtons slot="start">
          <IonMenuButton className="sidebar-button" />
        </IonButtons>

        <IonItem lines="none" className="pl--0">
          <IonTitle className="px-0 main-logo">
            <IonImg src="./img/logo-text.svg" className="mw-100"></IonImg>
          </IonTitle>
          <IonImg src={profileImg} className="mw-100 logo-dice"></IonImg>
        </IonItem>
      </IonToolbar>
    </IonHeader>
  );
};

export default Header;
