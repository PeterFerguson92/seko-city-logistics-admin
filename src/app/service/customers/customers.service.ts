import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { CustomersResponse, GET_ALL_CUSTOMERS } from './requests';

const LIMIT = 100
const CURSOR = null;

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  constructor(private apollo: Apollo) { }

  getCustomers() {
    return this.apollo.query<CustomersResponse>({
      query: GET_ALL_CUSTOMERS,
      variables: {
        limit: LIMIT, cursor: CURSOR,
      }
      });
  }
}
