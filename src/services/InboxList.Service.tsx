import axios from "axios";
import { Constants } from "../utils/constants";
import { CommonService } from "./Common.Service";
export async function fetchApproverInbox(obj:any) {
  try {
    let inboxListAPI = Constants.APPROVER_INBOX_LIST_API;
    const apiUrl = `${process.env.REACT_APP_API}${inboxListAPI}`;
    let dataObj = {
      type: 'post',
      url: apiUrl,
      data: {
        "searchText": obj?.searchText,
        "assignmentStatus": obj?.assignmentStatus
      },
      params: {
        sort: {},
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

