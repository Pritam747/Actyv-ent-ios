import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

export const applicationSlice = createSlice({
    name: "application",
    initialState: {
        applicationId: null,
    },
    reducers: {
        setApplicationIdRedux: (state, action) => {
            state.applicationId = action.payload;                        
        }        
    },
});

export const { setApplicationIdRedux } = applicationSlice.actions;
export default applicationSlice.reducer;

export const selectApplicationId = (state: RootState): string => state.application.applicationId;
