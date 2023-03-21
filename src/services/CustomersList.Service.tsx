import axios from 'axios';
import { Constants } from '../utils/constants';
import { CommonService } from './Common.Service';
export async function fetchCustomersList(obj: any) {
	try {
		let customersListApi = Constants.ACTYV_SCORE_CUSTOMERS_LIST;
		const apiUrl = `${process.env.REACT_APP_ACTYV_SCORE_URL}${customersListApi}`;
		let dataObj = {
			type: 'post',
			url: apiUrl,
			data: {
				enterpriseId: obj?.enterpriseId,
				searchText: obj?.searchText,
				offset: obj?.offset,
				limit: obj?.limit,
			},
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
