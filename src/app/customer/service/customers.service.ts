import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { ICustomersResponse, ICustomer } from '../domain';
import { CREATE_CUSTOMER, DELETE_CUSTOMER, GET_ALL_CUSTOMERS, GET_CUSTOMER_BY_REFERENCE, UPDATE_CUSTOMER } from './requests';

const LIMIT = 100
const CURSOR = null;

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  constructor(private apollo: Apollo) { }

  getCustomers() {
    return this.apollo.query<ICustomersResponse>({
      query: GET_ALL_CUSTOMERS,
      variables: {
        limit: LIMIT, cursor: CURSOR,
      }
    });
  }

  createCustomer(customer: ICustomer) {
    return this.apollo.mutate<ICustomer>({
      mutation: CREATE_CUSTOMER,
      variables: { input: customer }
    });
  }

  updateCustomer(reference: string, fields: any) {
    return this.apollo.mutate<ICustomer>({
      mutation: UPDATE_CUSTOMER,
      variables: { reference, fields }
    });
  }

  getCustomerByReference(reference: string) {
    return this.apollo.query<ICustomer>({
      query: GET_CUSTOMER_BY_REFERENCE,
      variables: {reference}
    });
  }

  deleteCustomer(reference: string) {
    return this.apollo.mutate<boolean>({
      mutation: DELETE_CUSTOMER,
      variables: {reference}
    });
  }

}
