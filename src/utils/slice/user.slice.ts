import { createSlice } from "@reduxjs/toolkit";

import { IBusinessPartner, IEnterprise, IUser } from "../interfaces/App.interface";

import { RootState } from "./store";


export const DEFAULT_BP: IBusinessPartner = {
  _id: "",
  businessName: "",
  gstin: "",
};

export const DEFAULT_ENTERPRISE: IEnterprise = {
  _id: "",
  eSignReturnURL: "",
  eSignTenant: "",
  key: "",
  name: "",
  theme: {},
};

const initialState: IUser = {
  id: "",
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  roles: [],
  userType: [],
  userName: "",  
  logo: "",    
  accessToken: "",  
  enterprise_id:""
};


export const userReducer = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {
      setUser: (state, { payload }) => payload,
      logOut: (state, { payload }) => {
        Object.assign(state, initialState);
        // localStorage.clear();
        const { redirect, cb } = payload;
        if (redirect) { window.location.href = (`${process.env.REACT_APP_BASE_PATH}/login`); }
        else if (cb) { cb(); }
      },
      setUserValue: (state, { payload }) => {
        const { key, value } = payload;
        state[key as keyof IUser] = value;
      }
   
    },
    
});

export const { setUser,logOut,setUserValue } = userReducer.actions;

export default userReducer.reducer;

export const selectUserState = (state: RootState): IUser => state.user;
export const selectUserType = (state: RootState): string[] => state.user.userType;
export const selectEnterpriseId = (state: RootState): string => state.user.enterprise_id;
export const selectAccessToken = (state: RootState): string => state.user.accessToken;

