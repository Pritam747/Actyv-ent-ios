import axios from 'axios';
import { Constants } from '../utils/constants';
import { ISaveDecisionRequest } from '../utils/models/ApplicationEnterpriseView.interface';
import { CommonService } from './Common.Service';


export async function saveDecision(
	payload: ISaveDecisionRequest,
	businessPartnerId: string
) {
	try {
		const apiUrl = `${process.env.REACT_APP_API}${Constants.DECISION_PANEL_UPDATE}`;

		let dataObj = {
			type: 'post',
			url: apiUrl,
			data: payload,
			headers: {
				"businesspartnerid": businessPartnerId
			}
		}
		return CommonService.fetchData(dataObj);

	}
	catch (e) {
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

export async function fetchApplicationOverview(obj: any) {
	try {
		const overviewAPI = Constants.APPLICATION_DETAIL_OVERVIEW_API;
		const apiUrl = `${process.env.REACT_APP_API}${overviewAPI}${obj.applicationId}`;

		let dataObj = {
			type: 'get',
			url: apiUrl,
		};
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

export async function fetchApplicationBusinessPartnerAndGstInfo(obj: any) {
	try {
		const businessPartnerAndGstInfoAPI =
			Constants.APPLICATION_DETAIL_BUSINESS_PARTNER_AND_GST_INFO;
		const apiUrl = `${process.env.REACT_APP_API}${businessPartnerAndGstInfoAPI}${obj.businessPartnerId}?gstin=${obj.gstin}`;
		let dataObj = {
			type: 'get',
			url: apiUrl,
		};
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

export async function fetchApplicationDocumentsList(obj: any) {
	try {
		const documentsAPI = Constants.APPLICATION_DETAIL_DOCUMENTS_LIST_API;
		const apiUrl = `${process.env.REACT_APP_API}${documentsAPI}${obj.applicationId}`;
		let dataObj = {
			type: 'get',
			url: apiUrl,
		};
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

export async function fetchApplicationDocumentRead(obj: any) {
	try {
		const documentsReadAPI = Constants.APPLICATION_DETAIL_DOCUMENT_READ;
		let res = await axios.get(
			`${process.env.REACT_APP_API}${documentsReadAPI}${obj.fileId}`,
			{
				responseType: 'blob',
			}
		);

		return {
			status: Constants.API_SUCCESS,
			data: res.data,
			url: `${process.env.REACT_APP_API}${documentsReadAPI}${obj.fileId}`,
		};
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

export async function fetchApplicationHistory(obj: any) {
	try {
		const historyAPI = Constants.APPLICATION_DETAIL_HISTORY_API;
		const apiUrl = `${process.env.REACT_APP_API}${historyAPI}${obj.applicationId}`;
		let dataObj = {
			type: 'get',
			url: apiUrl,
		};
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

export async function fetchApplicationActyvScore(obj: any) {
	try {
		const actyvScoreAPI = Constants.APPLICATION_DETAIL_ACTYV_SCORE;
		const apiUrl = `${process.env.REACT_APP_API}${actyvScoreAPI}${obj.businessPartnerId}`;
		let dataObj = {
			type: 'get',
			url: apiUrl,
		};
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

export async function fetchApplicationDetails(obj: any) {
	try {
	  const apiUrl = `${process.env.REACT_APP_API}${Constants.APPLICATION_DETAILS_API}${obj?.applicationId}`;
	  let dataObj = {
		type: "get",
		url: apiUrl,
	  };
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
  
  export async function fetchAppDetailsKeyLable(obj: any) {
	try {
	  const apiUrl = `${process.env.REACT_APP_API}${Constants.APPLICATION_DETAILS_KEY_AND_LABEL_API}${obj?.applicationId}`;
	  let dataObj = {
		type: "get",
		url: apiUrl,
	  };
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
  
