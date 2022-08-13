import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { GET_ALL_ORDERS } from './requests';
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
}
