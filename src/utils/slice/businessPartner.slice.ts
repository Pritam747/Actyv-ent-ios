import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

export const businessPartnerSlice = createSlice({
    name: "businessPartner",
    initialState: {
        businessPartnerId: null,
    },
    reducers: {
        setBusinessPartnerIdRedux: (state, action) => {
            state.businessPartnerId = action.payload;                        
        }        
    },
});

export const { setBusinessPartnerIdRedux } = businessPartnerSlice.actions;
export default businessPartnerSlice.reducer;

export const selectBusinessPartnerId = (state: RootState): string => state.businessPartner.businessPartnerId;
