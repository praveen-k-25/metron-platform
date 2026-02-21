import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "@/modules/auth/auth.slices";
import dashboardReducer from "@/modules/dashboard/dashboard.slice";
import { persistedStore } from "./store";
import { REDUXSTORE } from "@/shared/constant";

const appReducer = combineReducers({
  auth: authReducer,
  dashboard: dashboardReducer,
});

const rootReducer = (state: any, action: any) => {
  /* if (action.type === REDUXSTORE.TYPE) {
    await persistedStore.purge();
  } */
  return appReducer(state, action);
};

export default rootReducer;
