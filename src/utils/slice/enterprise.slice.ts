import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

export const enterpriseSlice = createSlice({
    name: "enterprise",
    initialState: {
        enterpriseUrl: null,
    },
    reducers: {
        setEnterpriseUrlRedux: (state, action) => {
            state.enterpriseUrl = action.payload;                        
        }        
    },
});

export const { setEnterpriseUrlRedux } = enterpriseSlice.actions;
export default enterpriseSlice.reducer;

export const selectEnterpriseUrl = (state: RootState): string => state.enterprise.enterpriseUrl;
