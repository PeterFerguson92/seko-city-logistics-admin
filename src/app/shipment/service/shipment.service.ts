import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { LIMIT, CURSOR } from 'src/app/constants';
import { IShipment, IShipmentsResponse } from '../model';
import {
  CREATE_SHIPMENT, DELETE_SHIPMENT, GET_ALL_SHIPMENTS,
  GET_SHIPMENT_BY_CONTAINER_NUMBER, GET_SHIPMENT_BY_REFERENCE, UPDATE_SHIPMENT
} from './requests';


@Injectable({
  providedIn: 'root'
})
export class ShipmentService {

  constructor(private apollo: Apollo) { }

  getShipments() {
    return this.apollo.query<IShipmentsResponse>({
      query: GET_ALL_SHIPMENTS,
      variables: {
        limit: LIMIT, cursor: CURSOR,
      }
    });
  }

  getShipmentByReference(reference: string) {
    return this.apollo.query<any>({
      query: GET_SHIPMENT_BY_REFERENCE,
      variables: {reference}
    });
  }

  getShipmentByContainerNumber(containerNumber: string) {
    return this.apollo.query<any>({
      query: GET_SHIPMENT_BY_CONTAINER_NUMBER,
      variables: {containerNumber}
    });
  }

  createShipment(shipment: any) {
    return this.apollo.mutate<IShipment>({
      mutation: CREATE_SHIPMENT,
      variables: { shipment }
    });
  }

  updateShipment(reference: string, fields: any) {
    return this.apollo.mutate<IShipment>({
      mutation: UPDATE_SHIPMENT,
      variables: { reference, fields }
    });
  }

  deleteShipment(reference: string) {
    return this.apollo.mutate<boolean>({
      mutation: DELETE_SHIPMENT,
      variables: {reference}
    });
  }
}
