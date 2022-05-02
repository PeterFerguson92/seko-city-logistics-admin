import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { GET_ITEMS_BY_SHIPMENT_REFERENCE } from './request';

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
}
