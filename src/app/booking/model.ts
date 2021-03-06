export interface IBookingsResponse {
  customers: [IBooking];
}

export interface IBooking {
  items: any;
  id: number;
  reference: string;
  senderId: number;
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
