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
  exporterAdress: string;
  exporterArea: string;
  exporterCity: string;
  containerNumber: string;
  blVessel: string;
  shipmentDate: string;
}
