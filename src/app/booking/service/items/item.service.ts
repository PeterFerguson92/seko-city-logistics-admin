import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { GET_ITEMS_BY_BOOKING_REFERENCE, GET_ITEMS_BY_SHIPMENT_REFERENCE, GET_ITEMS_REPORT_DATA, UPDATE_ITEM } from './request';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private apollo: Apollo) { }

  getItemsByShipmentReference(shipmentReference: string) {
    return this.apollo.query<any>({
      query: GET_ITEMS_BY_SHIPMENT_REFERENCE,
      variables: {shipmentReference}
    });
  }

  getItemsByBookingReference(bookingReference: string) {
    return this.apollo.query<any>({
      query: GET_ITEMS_BY_BOOKING_REFERENCE,
      variables: {bookingReference}
    });
  }

  getItemsReport() {
    return this.apollo.query<any>({
      query: GET_ITEMS_REPORT_DATA
    });
  }

  updateItem(id: number, fields: any) {
    return this.apollo.mutate<any>({
      mutation: UPDATE_ITEM,
      variables: { id, fields }
    });
  }

}
