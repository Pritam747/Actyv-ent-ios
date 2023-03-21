import axios from "axios";
import { Constants } from "../utils/constants";
import { store } from "../utils/slice/store";
import { CommonService } from "./Common.Service";
export async function fetchApplication(obj:any) {
  try {
    const applicationListAPI = Constants.APPLICATION_LIST_API;
    const enterpriseId = store.getState().user.enterprise_id
    let appId = enterpriseId;
    const apiUrl = `${process.env.REACT_APP_API}${applicationListAPI}${appId}`;
    let dataObj = {
      type: 'post',
      url: apiUrl,
      data: {
        "searchText": obj?.searchText,
        "filter": obj?.filter
      },
      params: {
        offset: obj?.offset,
        limit: obj?.limit,
      }
    }
    return CommonService.fetchData(dataObj);
  } catch (e) {
    if (axios.isAxiosError(e)) {      
      return {
        status: Constants.API_FAIL,
        message: e.message,
      };
    } else {
      return { status: Constants.API_FAIL, message: Constants.API_FAIL_MSG };
    }
  }
}
