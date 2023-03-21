import { Constants } from "../utils/constants";
import { IUser } from "../utils/interfaces/App.interface";
import { getSession } from "../utils/libs/cognito";
import { store } from '../utils/slice/store';
import { setUser } from "../utils/slice/user.slice";
import { CommonService } from "./Common.Service";

export class UserService{

    static async getCurrentUser(){
        const userSession = await getSession();    
        const accessToken = userSession.getIdToken().getJwtToken();

            let enterprise = store.getState().enterprise.enterpriseUrl;
            let obj = {
                type: 'get',
                url: `${process.env.REACT_APP_ACTYV_ADMIN_SVC_URL}` + Constants.GET_CURRENT_USER_API + encodeURIComponent(enterprise),
                parama:{
                    url:enterprise
                }
            }
            let res = await CommonService.fetchData(obj);
            if(res.status === Constants.API_SUCCESS){
                UserService.setUser(res.data!,accessToken)                
            }                
                
            return res;
    }

    static async setUser(userContext:any, token:string){
        const user: IUser = {
            email: userContext.email,
            firstName: userContext.fname,
            lastName: userContext.lname,
            id: userContext.__id,
            roles: userContext.roles,
            phoneNumber: userContext.phone,
            userName: userContext.userName,
            userType: userContext.type,                
            logo: userContext.logo,                        
            accessToken: token,                       
            enterprise_id: userContext.enterpriseId
          };
          store.dispatch(setUser(user));    
    }
}

