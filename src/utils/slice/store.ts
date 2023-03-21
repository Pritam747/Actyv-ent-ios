import { combineReducers, configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import storage from 'redux-persist/lib/storage';
import userReducer from "./user.slice";
import businessPartnerReducer from "./businessPartner.slice";
import applicationReducer from "./application.slice";
import enterpriseReducer from "./enterprise.slice";
import rememberMeReducer from "./remember.slice";

import {
  FLUSH, PAUSE,
  PERSIST, persistReducer,
  persistStore, PURGE,
  REGISTER, REHYDRATE
} from 'redux-persist';
import emailSlice from "./email.slice";
const persistConfig = {
    key: process.env.REACT_APP_STORE_KEY,
    storage
  }

const reducers = combineReducers({
    user: userReducer,    
    businessPartner:businessPartnerReducer,
    application:applicationReducer,
    enterprise:enterpriseReducer,
    rememberMe: rememberMeReducer,
    email: emailSlice
})
const persistedReducer = persistReducer(persistConfig, reducers)

export const store = configureStore({    
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store)
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
