export interface IBookingsResponse {
  customers: [IBooking];
}

export interface IBooking {
  id: number;
  reference: string;
  senderReference: string;
  senderFullName: string;
  receiverReferences: string[];
  destination: string;
  location: string;
  numberOfItems: number;
  totalAmount: number;
  paymentType: string;
  paymentStatus: string;
  paymentNotes: string;
  pickUpDate: string;
  pickUpTime: string;
  pickUpPostCode: string;
  pickUpAddress: string;
  updatesViaWhatsapp: boolean;
  status: string;
  shipmentReference: string;
  assignedDriverReference: string;
}
