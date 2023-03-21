import axios from "axios";
import { Constants } from "../utils/constants";
import { CommonService } from "./Common.Service";
import _ from "lodash";

export async function fetchApplicationActyvScoreNew(obj: any) {
  try {
    const actyvScoreAPI = Constants.APPLICATION_ACTYV_SCORE_API;
    const apiUrl = `${process.env.REACT_APP_ACTYV_SCORE_URL}${actyvScoreAPI}${obj.businessPartnerId}`;
    let dataObj = {
      type: "get",
      url: apiUrl,
    };
    console.log(apiUrl);
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

// // **********FOR TESTING API***************
// export const fetchData = () => {
//   return axios
//     .get(
//       "https://actyv-score-platform-backend.qa.actyv.com/api/actyv-score/find/63be80b7c2987f04b6d375a9"
//     )
//     .then((response) =>{
//       // console.log(response.data.data.reportData.scoreRangeLegend)
//       return response.data.data.reportData.scoreRangeLegend
// });
// };
// // fetchData();

export function getFinOverviewData(reportData: any) {
  let data = reportData?.reportData;
  let pickLatestKey = Constants.PICK_LATEST_OVERVIEW_ATT;
  let overviewData = [];
  for (let latestKey of pickLatestKey) {
    let overviewDataObj = {
      key: "",
      value: "",
    };
    let retObj = CommonService.findNestedObj(data, "title", latestKey.key);
    if (retObj) {
      overviewDataObj.key = latestKey.key;
      overviewDataObj.value = retObj?.year2;
      overviewData.push(overviewDataObj);
    }
  }
  _.each(overviewData, function (item) {
    item.key = _.find(Constants.PICK_LATEST_OVERVIEW_ATT, {
      key: item.key,
    }).label;
  });
  return overviewData;
}
