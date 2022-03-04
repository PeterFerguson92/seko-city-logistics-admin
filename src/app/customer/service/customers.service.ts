import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { CREATE_CUSTOMER, Customer, CustomersResponse, DELETE_CUSTOMER, GET_ALL_CUSTOMERS, GET_CUSTOMER_BY_REFERENCE } from './requests';

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

  createCustomer(fullName: string, address: string, postcode: string, phone: string, email: string, country: string,
                 type: string, destination: string, uuid: string) {
    return this.apollo.mutate<Customer>({
      mutation: CREATE_CUSTOMER,
      variables: { input: {fullName, address, postcode, phone, email, country, type, destination, uuid}}
    });
  }

  getCustomerByReference(reference: string) {
    return this.apollo.query<Customer>({
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
