import { EHRTabsService } from "../services/EHRTabs.Service";
import { Constants } from "../utils/constants";

const EHRTabs = (props) => {
  let actyvScore = props?.actyvScore;
  let data = [];
  const survivalStabilityObj = actyvScore?.data?.reportData?.stabilityAndSurvival;
  const insuranceObj = actyvScore?.data?.reportData?.insuranceRiskManagement;
  let fManagementObj = actyvScore?.data?.reportData?.financialManagement;
  let fStandingObj = actyvScore?.data?.reportData?.financialStanding;
  let accessToFinanceObj = actyvScore?.data?.reportData?.accessToFinance;
  let revenuePotentialObj = actyvScore?.data?.reportData?.revenuePotential;
  let year1 = actyvScore?.data?.reportData?.year1;
  let year2 = actyvScore?.data?.reportData?.year2;
  data.push(props.data);
  
  return (
    <>
      {data.map((obj) => {
         let paraObj = {
          constObj: [],
          year1: year1,
          year2: year2,
          tabObj: ''
        }
        if (obj.key === "financialManagement") {
          paraObj.constObj = Constants.financialManagement;
          paraObj.tabObj = fManagementObj;
          return (
            <>
            {EHRTabsService.renderTabs(paraObj)}
            </>
          );
        }
        if (obj.key === "financialStanding") {
          paraObj.constObj = Constants.financialStanding;
          paraObj.tabObj = fStandingObj;
          return (
            <>
            {EHRTabsService.renderTabs(paraObj)}
            </>
          );
        }
        if (obj.key === "accessToFinance") {
          paraObj.constObj = Constants.accessToFinance;
          paraObj.tabObj = accessToFinanceObj;
          return (
            <>
            {EHRTabsService.renderTabs(paraObj)}
            </>
          );
        }
        if (obj.key === "revenuePotential") {
          let revPotential:any = {
            revenuePotential: revenuePotentialObj
          }
          paraObj.constObj = Constants.revenuePotential;
          paraObj.tabObj = revPotential;
          return (
            <>
            {EHRTabsService.renderTabs(paraObj)}
            </>
          );
        }
        if (obj.key === "survivalAndStability") {
          paraObj.constObj = Constants.survivalAndStability;
          paraObj.tabObj = survivalStabilityObj;
          return (
            <>
            {EHRTabsService.renderTabs(paraObj)}
            </>
          );
        }
        if (obj.key === "insuranceRiskScore") {
          paraObj.constObj = Constants.insuranceRiskScore;
          paraObj.tabObj = insuranceObj;
          return (
            <>
            {EHRTabsService.renderTabs(paraObj)}
            </>
          );
        }
      })}
    </>
  );
};

export default EHRTabs;
