export interface IShipmentsResponse {
  shipments: [IShipment];
}

export interface IShipment{
  reference: string;
  portOfLoading: string;
  portOfDischarge: string;
  placeOfReceipt: string;
  loadingDate: string;
  consigneeName: string;
  consigneeAddress: string;
  exporterFullName: string;
  exporterPostcode: string;
  exporterAddress: string;
  exporterArea: string;
  exporterCity: string;
  containerNumber: string;
  blVessel: string;
  shipmentDate: string;
  totalAmountCharged: number,
  containerCharge: number,
  containerExtraCharge: number,
  loadersCost: number,
  loadingExtraCost: number,
  totalLoadingCost: number,
  loadingCostNotes: string,
  clearingCharge: number,
  incentives: number,
  totalGhDriversFood: number,
  totalGhDriversTips: number,
  thirdyPartyExpenses: number,
  carToAccraCheckpoint: number,
  carToKumasiCheckpoint: number,
  carToOtherCheckpoint: number,
  totalClearingCost: number,
  clearingNotes: string,
  totalExpenses: number,
  profit: number,
  notes: string
}
