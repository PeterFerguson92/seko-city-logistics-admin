import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { CREATE_ORDER, DELETE_ORDER, GET_ALL_ORDERS, GET_ORDER_BY_REFERENCE, UPDATE_ORDER } from './requests';
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

  createOrder(order: any) {
    return this.apollo.mutate<any>({
      mutation: CREATE_ORDER,
      variables: { order }
    });
  }

  updateOrder(reference: string, fields: any) {
    return this.apollo.mutate<any>({
      mutation: UPDATE_ORDER,
      variables: { reference, fields }
    });
  }

  deleteOrder(reference: string) {
    return this.apollo.mutate<boolean>({
      mutation: DELETE_ORDER,
      variables: {reference}
    });
  }
}
