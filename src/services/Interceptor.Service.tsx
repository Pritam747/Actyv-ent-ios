import axios, {
	AxiosError,
	AxiosInstance,
	AxiosRequestConfig,
	AxiosResponse
} from 'axios';
import { IUser } from '../utils/interfaces/App.interface';
import { getSession } from '../utils/libs/cognito';
import { store } from '../utils/slice/store';

const onRequest = async (
	config: AxiosRequestConfig
): Promise<AxiosRequestConfig> => {
	try {
		const userSession = await getSession();
		const token = userSession.getIdToken().getJwtToken();
		const loggedInUserState: IUser = store.getState().user;
		const businessPartnerState = store.getState().businessPartner;
		if (config.headers) {
			config.headers['Authorization'] = `Bearer ${token}`;
			config.headers['enterpriseid'] = config.headers['enterpriseid'] ? config.headers['enterpriseid'] : `${loggedInUserState.enterprise_id}`;
			config.headers['businesspartnerid'] = config.headers['businesspartnerid'] ? config.headers['businesspartnerid'] : businessPartnerState.businessPartnerId;			
		}
		return config;
	} catch (error) {
	} finally {
		return config;
	}
};

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
	console.error(`[request error] [${JSON.stringify(error)}]`);
	return Promise.reject(error);
};

const onResponse = (response: AxiosResponse): AxiosResponse => {
	return response;
};

const onResponseError = (error: AxiosError): Promise<AxiosError> => {
	console.error(`[response error] [${JSON.stringify(error)}]`);
	return Promise.reject(error);
};

const setupInterceptorsTo = (axiosInstance: AxiosInstance): AxiosInstance => {
	axiosInstance.interceptors.request.use(onRequest, onRequestError);
	axiosInstance.interceptors.response.use(onResponse, onResponseError);
	return axiosInstance;
};

setupInterceptorsTo(axios);