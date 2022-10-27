import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import {
  CREATE_ORDER, DELETE_ORDER, FILTER_ORDERS, GET_ALL_ORDERS,
  GET_ORDERS_REPORT_DATA, GET_ORDER_BY_REFERENCE, SYNC_ORDER, UPDATE_ORDER,
  UPDATE_ORDERS_BY_REFERENCES, UPDATE_ORDER_ASSIGNED_DRIVER, UPDATE_ORDER_STATUS
} from './requests';
import { CURSOR, LIMIT } from '../../constants';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private apollo: Apollo) { }

  getOrders() {
    return this.apollo.query<any>({
      query: GET_ALL_ORDERS,
      variables: {
        limit: LIMIT, cursor: CURSOR,
      }
    });
  }

  getOrderByReference(reference: string) {
    return this.apollo.query<any>({
      query: GET_ORDER_BY_REFERENCE,
      variables: {reference}
    });
  }

  filterOrders(fields: any) {
    return this.apollo.query<any>({
      query: FILTER_ORDERS,
      variables: { fields }
    });
  }

  createOrder(order: any, attachInvoice, isPending) {
    return this.apollo.mutate<any>({
      mutation: CREATE_ORDER,
      variables: { order, attachInvoice, isPending }
    });
  }

  updateOrder(reference: string, fields: any) {
    return this.apollo.mutate<any>({
      mutation: UPDATE_ORDER,
      variables: { reference, fields }
    });
  }

  updateOrderStatus(reference: string, status: string) {
    return this.apollo.mutate<any>({
      mutation: UPDATE_ORDER_STATUS,
      variables: { reference, status }
    });
  }

  updateOrderAssignedDriver(reference: string, assignedDriverReference: string) {
    return this.apollo.mutate<any>({
      mutation: UPDATE_ORDER_ASSIGNED_DRIVER,
      variables: { reference, assignedDriverReference }
    });
  }

  updateOrdersByReferences(references: [string], fields: any) {
    return this.apollo.mutate<any>({
      mutation: UPDATE_ORDERS_BY_REFERENCES,
      variables: { references, fields }
    });
  }

  syncOrder(order: any) {
    return this.apollo.mutate<any>({
      mutation: SYNC_ORDER,
      variables: { input: order }
    });
  }

  deleteOrder(reference: string) {
    return this.apollo.mutate<boolean>({
      mutation: DELETE_ORDER,
      variables: {reference}
    });
  }

  getOrdersReport() {
    return this.apollo.query<any>({
      query: GET_ORDERS_REPORT_DATA
    });
  }
}
