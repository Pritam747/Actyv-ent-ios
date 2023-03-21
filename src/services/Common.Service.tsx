import { FileOpener } from "@awesome-cordova-plugins/file-opener";
import { Directory, Filesystem } from "@capacitor/filesystem";
import { IonCol, IonImg, IonRow } from "@ionic/react";
import axios from "axios";
import { Constants } from "../utils/constants";
import { displayDate, displayDateTime } from "../utils/DateTimeUtils";
import { store } from "../utils/slice/store";
import { log, Mlogger } from "./MLogger.Service";
import _ from "lodash";

export class CommonService {
  static statusToDisplayFormat(status: string) {
    status = status.replaceAll("_", " ");
    status = status.toLowerCase();
    let statusWords = status.split(" ");
    for (let i = 0; i < _.size(statusWords); i++) {
      statusWords[i] =
        statusWords[i].charAt(0).toUpperCase() + statusWords[i].slice(1);
    }
    status = statusWords.join(" ");
    return status;
  }

  static async fetchData(obj: any) {
    try {
      const url = obj?.url;
      const data = obj?.data;
      const params = obj?.params;
      const headers = obj?.headers;

      let config = {
        params: params,
      };
      if (headers) config["headers"] = headers;
      if (obj?.type === "post") {
		let res = await axios.post<any>(url, data, config);
        return {
          status: Constants.API_SUCCESS,
          data: res.data,
        };
      }
      if (obj.type === "get") {
		let res = await axios.get<any>(url);
        return {
          status: Constants.API_SUCCESS,
          data: res.data,
        };
        
      }
    } catch (e) {
      if (axios.isAxiosError(e)) {
        return {
          status: Constants.API_FAIL,
          message: e.message,
        };
      } else {
        return {
          status: Constants.API_FAIL,
          message: Constants.API_FAIL_MSG,
          error: e,
        };
      }
    }
  }

  static convertBlobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });

  static scoreRangeToTextAndColor = (score: number) => {
    let obj = {
      text: "",
      color: "",
    };
    if (score > 80) {
      obj.text = "Excellent";
      obj.color = "#00FF00";
      return obj;
    } else if (score <= 80 && score >= 66) {
      obj.text = "Very Good";
      obj.color = "#00FF00";
      return obj;
    } else if (score <= 65 && score >= 51) {
      obj.text = "Good";
      obj.color = "#00FF00";
      return obj;
    } else if (score <= 50 && score >= 41) {
      obj.text = "Cautious";
      obj.color = "#FF991F";
      return obj;
    } else if (score <= 40) {
      obj.text = "High Risk";
      obj.color = "#FF0000";
      return obj;
    }
  };

  static camelToTitle = (text: any) => {
    const result = text.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
  };

  static snakeToTitle = (text: any) => {
    const result = text
      .replace(/^_*(.)|_+(.)/g, (s, c, d) =>
        c ? c.toUpperCase() : " " + d.toUpperCase()
      )
      .toLowerCase();
    return result.charAt(0).toUpperCase() + result.slice(1);
  };

  static historyTab = (data: any) => {
    const DECISION_STRING_MAPPING = Constants.DECISION_STRING_MAPPING;
    if (!data?.eventType) return null;
    switch (data.eventType) {
      case "state_transition":
        if (data.eventType === "state_transition" && data?.toState === "INITIATED") {
          return (
            <>
              <p className="fs-14 fw-400">{displayDate(data?.timestamp)}</p>
              <p className="fs-16 fw-600">{Constants.APPLICATION_STARTED}</p>
            </>
          );
        }
        return (
          <>
            <p className="fs-14 fw-400">{displayDateTime(data?.timestamp)}</p>
            <IonRow className="ion-align-items-center">
              <IonCol size="auto">
                <p>{Constants.APPLICATION_STATE_CHANGED}</p>
              </IonCol>
              <IonCol size="auto">
                <p className="d-flex">
                  <strong>
                    {CommonService.statusToDisplayFormat(data?.fromState)}
                  </strong>
                </p>
              </IonCol>
              <IonCol size="auto">
                <IonImg className="" src="./img/right-arrow-line.svg"></IonImg>
              </IonCol>
              <IonCol size="auto">
                <p className="d-flex">
                  <strong>
                    {CommonService.statusToDisplayFormat(data?.toState)}
                  </strong>
                </p>
              </IonCol>
            </IonRow>
          </>
        );
      case "assignment":
        return (
          <>
            <p className="fs-14 fw-400">{displayDate(data?.timestamp)}</p>
            <p className="fs-16 fw-600">
              {_.get(DECISION_STRING_MAPPING, data?.eventType, data?.eventType)}{" "}
              <strong>{data?.identifier}</strong>
            </p>
          </>
        );
      default:
        return (
          <>
            <p className="fs-14 fw-400">{displayDate(data?.timestamp)}</p>
            <p className="fs-16 fw-600">
              <strong>{data?.identifier}</strong>{" "}
              {_.get(DECISION_STRING_MAPPING, data?.eventType, data?.eventType)}
            </p>
            <p className="fs-16 fw-600"> {data?.remarks}</p>
          </>
        );
    }
  };

  static getActyScoreBarLabelsList = (scoreBreakdown: any) => {
    let labelsList = [];
    Object.entries(scoreBreakdown).map((item) => {
      if (typeof item[1] === "number" && item[0] !== "actyvScore") {
        labelsList.push(item[0]);
      }
    });
    for (let i = 0; i < _.size(labelsList); i++) {
      labelsList[i] = this.camelToTitle(labelsList[i]);
    }
    return labelsList;
  };

  static getActyScoreBarDatas = (scoreBreakdown: any) => {
    let barDatas = [];
    Object.entries(scoreBreakdown).map((item) => {
      if (typeof item[1] === "number" && item[0] !== "actyvScore") {
        barDatas.push(item[1]);
      }
    });
    return barDatas;
  };

  static getDocumentsTabPanel = (docType, documentData) => {
    let documents = [];
    for (let i = 0; i < _.size(documentData); i++) {
      if (docType === documentData[i].documentType) {
        documents.push(documentData[i]);
      }
    }
    return documents;
  };

  static readFilesPDF = async (blob: Blob, type: any, path: any) => {
    const name = path;
    const base64 = (await this.convertBlobToBase64(blob)) as string;

    const savedData = await Filesystem.writeFile({
      path: `${name}.pdf`,
      data: base64,
      directory: Directory.Documents,
    });

    FileOpener.open(savedData.uri, type)
      .then(() => console.log("File Opened"))
      .catch((e) => console.log("Cannot open file", e));
  };

  static systemException(obj: any) {
    console.log({
      obj: obj,
    });
    this.logger(
      Mlogger.severity.debug,
      [],
      Mlogger.step.log,
      obj.fileName + " in " + obj.functionName,
      obj.error
    );
  }

  static logger(
    severity: any,
    obj: any,
    step: any,
    fn_name: any,
    fn_param: any
  ) {
    if (1) {
      let array;
      let operation;
      let data;
      let userEmail = store.getState()?.user?.email;
      switch (step) {
        case Mlogger.step.start:
          array = step;
          operation = "Start: ";
          data = {
            fn_start_time: performance.now(),
          };
          break;
        case Mlogger.step.log:
          operation = "Log: ";
          let paramObj = {
            data: fn_param,
            message: operation + fn_name,
            timestamp: Math.floor(Date.now() / 1000),
          };
          log(
            severity,
            step,
            "",
            userEmail,
            "",
            "",
            operation + fn_name,
            "",
            paramObj
          );
          return;
        case Mlogger.step.end:
          array = 1;
          operation = "End: ";
          data = {
            fn_end_time: performance.now(),
          };
          break;
      }
      data = { fn_param: fn_param };
      data = { fn_name: fn_name };
      obj[array] = {
        data: data,
        message: operation + fn_name,
        timestamp: Math.floor(Date.now() / 1000),
      };
      log(0, step, "", userEmail, "", "", operation + fn_name, "", obj);
    }
  }

  static findNestedObj(obj, key, value) {
    // Base case
    if (obj[key] === value) {
      return obj;
    } else {
      var keys = Object.keys(obj); // add this line to iterate over the keys
      for (var i = 0, len = _.size(keys); i < len; i++) {
        var k = keys[i]; // use this key for iteration, instead of index "i"

        // add "obj[k] &&" to ignore null values
        if (obj[k] && typeof obj[k] == "object") {
          var found = this.findNestedObj(obj[k], key, value);
          if (found) {
            // If the object was found in the recursive call, bubble it up.
            return found;
          }
        }
      }
    }
  }
}
