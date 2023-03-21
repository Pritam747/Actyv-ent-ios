import {
	IonAccordion,
	IonAccordionGroup,
	IonButton,
	IonCard,
	IonCardContent,
	IonCol,
	IonGrid,
	IonInput,
	IonItem,
	IonLabel,
	IonList,
	IonRow,
	useIonModal,
} from '@ionic/react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
	fetchAppDetailsKeyLable,
	fetchApplicationBusinessPartnerAndGstInfo,
	fetchApplicationDetails,
	fetchApplicationDocumentRead,
} from '../services/ApplicationDetail.Service';
import { CommonService } from '../services/Common.Service';
import { Constants } from '../utils/constants';
import _ from 'lodash';
import Loader from './Loader';
import { TableView } from './TableView/TableView';
import ZoomedModel from './ZoomedModel';
import { OverlayEventDetail } from '@ionic/react/dist/types/components/react-component-lib/interfaces';

const OverviewDetails: React.FC<{
	appId: string;	
}> = (props) => {
	const accordionGroup = useRef<null | HTMLIonAccordionGroupElement>(null);
	const { t } = useTranslation();
	const [loadingFetch, setLoadingFetch] = useState(false);
	const [loading, setLoading] = useState(false);
	const [dataList, setDataList] = useState(false);
	const [zoomedDocumentFile, setZoomedDocumentFile] = useState<any>();
	const [zoomedDocumentData, setZoomedDocumentData] = useState<any>();
	const [keyLabelList, setKeyLabelList] = useState(false);
	const [zoomedModal, dismissZoomedModal] = useIonModal(ZoomedModel, {
		onDismiss: (data: string, role: string) => dismissZoomedModal(data, role),
		file: zoomedDocumentFile,
		data:zoomedDocumentData,    
	  });

	useEffect(() => {
		setLoading(true);
		setLoadingFetch(true);
		fetchData();
		fetchKeyLable();
		if (!accordionGroup.current) {
			return;
		}
		accordionGroup.current.value = [''];
	}, []);

	const fetchData = async (isFirstLoading = true) => {
		setLoadingFetch(true);
		let obj = {
			applicationId: props.appId
		};
		let res = await fetchApplicationBusinessPartnerAndGstInfo(obj);
		console.log(res.data);
		
		if (res.status === Constants.API_SUCCESS) {
			setDataList(res?.data);
			setLoadingFetch(false);
		} else {
			let obj = {
				fileName: 'OverviewDetails.tsx',
				functionName: 'fetchData()',
				error: res.message,
			};
			setLoadingFetch(false);
			CommonService.systemException(obj);
		}
		setLoadingFetch(false);
	};

	const fetchKeyLable = async (isFirstLoading = true) => {
		setLoading(true);
		let obj = {
			applicationId: props.appId
		};
		let res = await fetchAppDetailsKeyLable(obj);
		if (res.status === Constants.API_SUCCESS) {
			setKeyLabelList(res?.data);
			setLoading(false);
		} else {
			let obj = {
				fileName: 'OverviewDetails.tsx',
				functionName: 'fetchKeyLable()',
				error: res.message,
			};
			setLoading(false);
			CommonService.systemException(obj);
		}
		setLoading(false);
	};

	const transformText = (input: string) =>
		_.startCase(_.toLower(_.join(_.split(input, '_'), ' ')));

	const formatKeyToName = (key: string) =>
		key === 'otherDetails' ? 'Other Details' : transformText(key);

	const renderObjectData = (data: any) => {
		if (_.isObject(data) && _.get(data, 'fileId')) {
			return _.isObject(data) && _.get(data, 'fileId') ? (
				<IonButton
					className='fs-14 fw-600 button-link'
					fill='clear'
					onClick={() => {
						data.data ? openZoomedModel(data, data?.data) : readDocument(data);
					}}
				>
					{t('VIEW')}
				</IonButton>
			) : (
				_.trim(data) || '-'
			);
		}

		return (_.isArray(data) && _.size(data) === 2) ||
			(_.isArray(data) && _.size(data) < 2) ? (
			<TableView initialValue={data} formState={[]} path='' />
		) : (
			<IonInput
				value={data ? data : '-'}
				class='label-input'
				placeholder='-'
				readonly
			></IonInput>
		);
	};

	const openZoomedModel = (file: any, data: any) => {
		setZoomedDocumentFile(file);
		setZoomedDocumentData(data);

		zoomedModal({
			cssClass: "zoom-modal",
			onWillDismiss: async (ev: CustomEvent<OverlayEventDetail>) => {
	  
			}
		  })
	};


	const readDocument = async (file: any) => {
		let obj = {
			fileId: file.fileId,
		};

		let res = await fetchApplicationDocumentRead(obj);
		if (res.status === Constants.API_SUCCESS) {
			CommonService.readFilesPDF(res.data, file.fileType, file.fileId);
		}
	};

	return (
		<>
			<Loader isloading={loading && loadingFetch} />
			{!_.isEmpty(dataList) && !loading && !loadingFetch && (
				<h4 className='ion-padding-horizontal fs-20 fw-700 dark pt-11'>
					{t('FIELDS_TAB')}
				</h4>
			)}
			{_.isEmpty(dataList) && !loading && !loadingFetch && (
				<IonCard className='overflow-visible primary-card no-shadow border-1 br-8'>
					<IonCardContent className='card-content'>
						<IonRow className='ion-align-items-center'>
							<IonCol>
								<h5 className='fs-16 fw-600 ion-text-center'>
									{Constants.DATA_UNAVAILABLE_MSG}
								</h5>
							</IonCol>
						</IonRow>
					</IonCardContent>
				</IonCard>
			)}
			<IonAccordionGroup ref={accordionGroup} multiple={true}>
				<>
					{!loading &&
						!loadingFetch &&
						dataList &&
						_.map(_.entries(dataList), ([key, value]: [string, string]) => {
							const isEmptyEntry = _.isEmpty(value);
							return (
								<IonCard className='acc-card no-shadow border-1'>
									<IonAccordion value={key} disabled={isEmptyEntry}>
										<IonItem className='py-8' slot='header' lines='none'>
											<div>
												<IonLabel className='fw-600 fs-14'>
													{keyLabelList
														? _.get(
																_.find(keyLabelList, ['key', key]),
																'label',
																formatKeyToName(key)
														  )
														: formatKeyToName(key)}
												</IonLabel>
											</div>
										</IonItem>
										<div
											className='d-inline-block w-100 p-relative content-acc'
											slot='content'
										>
											<IonGrid className='ion-padding-horizontal'>
												<IonRow>
													<IonCol>
														<IonList className='py-0'>
															<>
																{Object.keys(value).map((obj) => {
																	return (
																		<IonItem
																			lines='none'
																			className='input-item-labeled mb-10'
																		>
																			<IonLabel
																				className='fs-13 mb-9 label-sm'
																				position='stacked'
																			>
																				{_.get(
																					_.find(keyLabelList, ['key', obj]),
																					'label',
																					formatKeyToName(obj)
																				)}
																			</IonLabel>

																			<IonItem
																				lines='none'
																				className='input-item'
																			>
																				{renderObjectData(value[obj])}
																			</IonItem>
																		</IonItem>
																	);
																})}
															</>
														</IonList>
													</IonCol>
												</IonRow>
											</IonGrid>
										</div>
									</IonAccordion>
									{/* {showZoomedModel()} */}
								</IonCard>
							);
						})}
				</>
			</IonAccordionGroup>
		</>
	);
};

export default OverviewDetails;
