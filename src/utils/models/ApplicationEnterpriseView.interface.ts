export interface IBusinessPartner {
  readonly _id: string;
  readonly gstin: string;
  readonly businessName: string;
  readonly businessVintage: string;
  readonly ownershipOfProperty: string;
  readonly successionPlan: string;
}

export interface ISaveDecisionRequest {
  applicationId: string;
  decision: IAssignAction | undefined;
  remarks: string;
  correctionItems: ICorrectionItems;
}

export interface ISaveDecisionResponse {
  success: boolean;
  message: string;
}

export interface ICorrectionItems {
  documentIds: string[];
  formKeys: string[];
}

export interface IBusinessPartnerApplicationState {
  status: 'INITIATED' | 'DOCUMENT_CAPTURE' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED';
  workflowState: string;
  updatePath: string;
  action: IBusinessPartnerApplicationStateAction,
  assignTo: [IBusinessPartnerApplicationAssignee]
}

export interface IBusinessPartnerApplicationStateAction {
  name: string;
  by: string;
  startTimestamp: string;
  endTimestamp: string;
}

export interface IBusinessPartnerApplicationAssignee {
  identifierType: string;
  identifier: string;
  resolutionStatus: "PENDING" | "RESOLVED";
  decision: string;
  remarks: string;
  additionalData: IBusinessPartnerApplicationAdditionalData;
  createdAt: string;
}

export interface IBusinessPartnerApplicationAdditionalData {
  formConfigKey: string;
  correctionItems: string[];
  approverContext: IApproverContext;
}

export interface IApproverContext {
  actions: IAssignAction[];
}

export interface IAssignAction {
  label: string;
  value: string;
  variableName: string;
  actionType: "DECISION" | "CORRECTION";
}
