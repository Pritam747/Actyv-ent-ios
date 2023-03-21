export class Constants {
	static API_SUCCESS = 'SUCCESS';
	static API_FAIL = 'FAIL';
	static LOGIN_SUCCESS_MSG = 'Logged in successfully.';
	static OTP_SENT_SUCCESS_MSG = 'OTP sent successfully.';
	static PASSWORD_NOT_MATCH_MSG = 'Entered password and new password doesnt match.';
	static API_FAIL_MSG = 'Something went wrong, Please try again.';
	static APPLICATION_STARTED = 'Business Partner application initiated.';
	static APPLICATION_STATE_CHANGED = 'Application status changed:';
	static DATA_UNAVAILABLE_MSG = 'Data not available.';
	static FILE_UNAVAILABLE_MSG = 'File not available.';
	static ITEMS_PER_PAGE = 30;
	static TOAST_DURATION = 2500;
	static DEBOUNCE_TIME = 600;
	static APPROVER_INBOX_LIST_API =
		'/api/business-partner-application/assigned-applications';

	'/api/business-partner-application/assigned-applications/';
	static CREATE_PASSWORD = '/api/user/createPassword';
	static GET_ENTERPRISE_URL_API = '/api/user/getEnterpriseUrl';
	static API_STRING = 'api';
	static ACTYV_SCORE_PATH = '/app/customers/actyv-score/';
	static APPLICATION_LIST_API =
		'/api/business-partner-application/applications/';
	static ERROR_MSG = 'Something went wrong';
	static APPLICATION_DETAIL_OVERVIEW_API =
		'/api/business-partner-application/overview/';
	static GET_CURRENT_USER_API =
		'/api/user/getCurrentUser?url=';
	static APPLICATION_DETAIL_BUSINESS_PARTNER_AND_GST_INFO =
		'/api/business-partner/businessPartnerAndGstInfo/';
	static APPLICATION_DETAIL_DOCUMENTS_LIST_API =
		'/api/business-partner-application/documents/';
	static APPLICATION_DETAIL_HISTORY_API =
		'/api/business-partner-application/history/';
	static APPLICATION_DETAIL_ACTYV_SCORE = '/api/actyv-score/';
	static APPLICATION_ACTYV_SCORE_API = '/api/actyv-score/find/';
	static APPLICATION_DETAIL_DOCUMENT_READ = '/api/file/read/';
	static DECISION_PANEL_UPDATE =
		'/api/business-partner-application/decision/update';
	static APPLICATION_DETAILS_API = '/api/business-partner-application/details/';
	static APPLICATION_DETAILS_KEY_AND_LABEL_API =
		'/api/enterprise-form-config/labelAndKey/';
	static ACTYV_SCORE_CUSTOMERS_LIST = '/api/actyv-score/find-business-partners';
	static APP_STATUS = ['COMPLETED', 'REJECTED'];
	static DECISION_PANEL_STATUS = ['Approve', 'Reject'];
	static APP_FILTER = [
		{
			id: 1,
			filter: 'All Applications',
			value: '',
		},
		{
			id: 2,
			filter: 'Status - Pending',
			value: 'PENDING',
		},
		{
			id: 3,
			filter: 'Status - Initiated',
			value: 'INITIATED',
		},
		{
			id: 4,
			filter: 'Status - Under Review',
			value: 'UNDER_REVIEW',
		},
		{
			id: 5,
			filter: 'Status - Completed',
			value: 'COMPLETED',
		},
		{
			id: 6,
			filter: 'Status - Document Capture',
			value: 'DOCUMENT_CAPTURE',
		},
		{
			id: 7,
			filter: 'Status - Rejected',
			value: 'REJECTED',
		},
	];
	static APP_INBOX_FILTER = [
		{
			id: 1,
			filter: 'All Applications',
			value: '',
		},
		{
			id: 2,
			filter: 'Assigned to Me',
			value: 'PENDING',
		},
	];

	static EHR_TABS_LIST = [
		{ name: 'Financial Management', key: 'financialManagement' },
		{ name: 'Financial Standing', key: 'financialStanding' },
		{ name: 'Access To Finance', key: 'accessToFinance' },
		{ name: 'Stability And Survival', key: 'survivalAndStability' },
		{ name: 'Revenue Potential', key: 'revenuePotential' },
		{ name: 'Insurance Data', key: 'insuranceRiskScore' },
	];

	static NEW_EHR_TABS_LIST = [
		{ name: 'Financial Management', key: 'financialManagement' },
		{ name: 'Financial Standing', key: 'financialStanding' },
		{ name: 'Access to Finance', key: 'accessToFinance' },
		{ name: 'Stability & Survival', key: 'survivalAndStability' },
		{ name: 'Revenue Potential', key: 'revenuePotential' },
		{ name: 'Insurance Risk', key: 'insuranceRiskScore' },
	];

	static financialManagement = [
		{ name: 'FINANCIAL ELEMENTS', key: 'financialElements', icon: 'financial-icon.svg'},
		{ name: 'LIQUIDITY RATIOS', key: 'liquidityRatios', icon: 'liquidity-icon.svg'},
		{ name: 'PROFITABILITY RATIO', key: 'profitabilityRatios', icon: 'leverage-icon.svg'},
		{ name: 'WORKING CAPITAL DAYS', key: 'accountsReceivableDays', icon: 'filing-icon.svg'},
		{ name: 'BANKING ELEMENTS', key: 'bankingElements', icon: 'banking-icon.svg'},
		{ name: 'GST PAYMENT DELAYS', key: 'statutoryPayments', icon: 'delay-icon.svg'},
	];

	static financialStanding = [
		{ name: 'FINANCIAL ELEMENTS', key: 'financialElements', icon: 'financial-icon.svg'},
		{ name: 'LEVERAGE RATIO', key: 'leverageRatios', icon: 'leverage-icon.svg'},
		{ name: 'ITR FILLING', key: 'itrFiling', icon: 'leverage-icon.svg'},
		{ name: 'BANKING/GST ELEMENTS', key: 'bankingElements', icon: 'banking-icon.svg'},
	];

	static accessToFinance = [
		{ name: 'FINANCIAL ELEMENTS', key: 'financialElements',icon: 'financial-icon.svg'},
		{ name: 'BUREAU ELEMENTS', key: 'bureauElements',icon: 'bureau-icon.svg'},
	];

	static revenuePotential = [
		{ name: 'Revenue Potential', key: 'revenuePotential',icon: 'financial-icon.svg'},
	];

	static insuranceRiskScore = [
		{ name: 'INSURANCE ELEMENTS', key: 'insuranceRiskScore',icon: 'bureau-icon.svg'},
	];

	static survivalAndStability = [
		{ name: 'DEMOGRAPHIC ELEMENTS', key: 'survivalAndStability',icon: 'bureau-icon.svg'},
	];

	static PICK_LATEST_AND_YEARLY = {
		financialAccess: {
			latest: [
				'bureauScore',
				'totalLoanOutstanding',
				'maxLoanEligibility',
				'loansSettled',
			],
			yearly: ['dscr', 'totalSecuredUnsecuredLoans'],
		},
		financialManagement: {
			yearly: [
				'accountsReceivables',
				'grossProfitMargin',
				'interestPayable',
				'netProfit',
				'debtorDays',
				'creditorDays',
				'expenseTurnoverMargin',
				'netProfitMargin',
				'currentRatio',
				'quickRatio',
				'interestCoverageRatio',
			],
			latest: ['inwardBounces6Months', 'outwardBounces6Months'],
		},
		financialStanding: {
			yearly: [
				'ebitda',
				'pbit',
				'ebitdaMargin',
				'debthToCapitalEmployed',
				'totalRevenue',
			],
			latest: [
				'emiBounceCounts6Month',
				'odUtilization6Months',
				'gstTrend',
				'itrFilingGap',
			],
		},
		survivalStability: {
			latest: [
				'ageOfBorrower',
				'businessVintage',
				'ownershipOfProperty',
				'successionPlan',
			],
		},
		insuranceData: {
			latest: [
				'keyManInsurance',
				'commercialPropertyInsurance',
				'fireAndBurglaryInsurance',
				'plantAndMachineryInsurance',
				'propertyInTransit',
				'commercialAutoOrVehicle',
			],
		},
		revenuePotential: {
			latest: [
				'turnOver',
				'debtFreeReturn',
				'revenueToExpenseRatio',
				'loanEligibilityToCurrentSales',
			],
		},
	};

	static EXCLUDE_RUPEE_FORMAT = [
		'creditorDays',
		'debtorDays',
		'itrFilingGap',
		'bureauScore',
		'dscr',
		'ebitaMargin',
		'debthToCapitalEmployed',
		'expenseToTurnoverRatio',
		'expenseTurnoverMargin',
		'currentRatio',
		'netProfitMargin',
		'grossProfitMargin',
		'quickRatio',
		'revenueToExpenseRatio',
		'interestCoverageRatio',
		'ebitdaMargin',
		'inwardBounces6Months',
		'outwardBounces6Months',
		'loanEligibilityToCurrentSales',
		'emiBounceCounts6Month',
	];
	static INCLUDE_PERCENTAGE = [
		'netProfitMargin',
		'grossProfitMargin',
		'ebitdaMargin',
	];

	static FM_RATIOS = ['currentRatio', 'quickRatio', 'interestCoverageRatio'];
	static ABBRIVATION_CAPS = {
		ebitda: 'EBITDA',
		pbit: 'PBIT',
		ebitdaMargin: 'EBITDA Margin',
		itrFilingGap: 'ITR Filing Gap',
		grossProfitMargin: 'Gross Margin',
		inwardBounces6Months: 'No of IW Bounces in last 6 month',
		outwardBounces6Months: 'No of OW Bounces in last 6 month',
		emiBounceCounts6Month: 'EMI Bounces',
		odUtilization6Months: 'OD/CC utilization % in last 6 months',
		gstTrend: 'GST Trend(current year)',
	};

	static nameMapping = {
		ITR: "ITR",
		GSTR: "GSTR",
		CIN: "CIN",
		GST: "GST",
		GSTR_FILES: "GSTR Files",
		PERSONAL_PAN: "Personal PAN",
		BUSINESS_PAN: "Business PAN",
		MISCELLANEOUS_DOCUMENT: "Miscellaneous Documents",
  	};

	static docList = ["Itr", "Pan", "Gstr", "Gst", "Cin"];

	static labelMapping = {
		financialManagement: ['Financial', 'Management'],
		financialStanding: ['Financial', 'Stability'],
		accessToFinance: ['Access To', 'Finance'],
		survivalAndStability: ['Stability And', 'Survival'],
		revenuePotential: ['Revenue', 'Potential'],
		insuranceRiskScore: ['Insurance', 'Risk']
	}
	  
	static ACTYV_SCORE_DEFAULT = {
		actyvcore: 90,
		financialManagement: 60,
		financialStanding: 30,
		accessToFinance: 80,
		survivalAndStability: 90,
		revenuePotential: 50,
		insuranceRiskScore: 70
	}

	static PICK_LATEST_OVERVIEW_ATT = [
		{ key: 'Total Revenue', label: 'Total Revenue' },
		{ key: 'EBITDA margin', label: 'EBITDA Margin' },
		{ key: 'Net Profit Margin', label: 'Net Profit Margin' },
		{ key: 'Debt to Equity ratio', label: 'Debt To Equity' },
		{ key: 'Total secured/unsecured loans ^', label: 'Borrowings' },
		{ key: 'Bureau score *', label: 'Bureau Score' },
		{ key: 'Return on capital employed', label: 'Return on Capital Employed' },
		{ key: 'Return on networth', label: 'Return on Networth' },
	];

	static CHART_BACKGROUND_COLOR = [
		"#EC2023",
		"#F06029",
		"#CB34B4",
		"#25B99B",
		"#3F7B3B",
		"#B2D234",
	  ]

	static barOption = {
		responsive: true,
		maintainAspectRatio: false,
		scales: {
		  y: {
			beginAtZero: true,
			max: 100,
			ticks: {
			  stepSize: 0,
			},
		  },
		  x: {
			ticks: {
			  display: true,
			  fontSize: 10,
			  autoSkip: false,
			  maxRotation: -38,
			  minRotation: -38,
			  labelOffset: 20,
 			  padding:40,
			},
		  },
		},
		plugins: {
		  legend: {
			display: false,
		  },
		},
	};
	
	static DECISION_STRING_MAPPING = {
		APPROVE: "approved the application.",
		REJECT: "rejected the application.",
		CORRECTION: "requested correction on the application.",
		submit: "completed document upload.",
		assignment: "Application assigned to",
		SUBMIT: "submitted a form and approved the application.",
	  };
}
