import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { ICustomersResponse, ICustomer } from '../model';
import {
  CREATE_CUSTOMER, CREATE_CUSTOMERS, DELETE_CUSTOMER, GET_ALL_CUSTOMERS,
 GET_CUSTOMERS_BY_REFERENCES, GET_CUSTOMER_BY_REFERENCE, UPDATE_CUSTOMER
} from './requests';

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

  getCustomersByReferences(references: [string]) {
    return this.apollo.query<any>({
      query: GET_CUSTOMERS_BY_REFERENCES,
      variables: {references}
    });
  }

  getCustomerByReference(reference: string) {
    return this.apollo.query<any>({
      query: GET_CUSTOMER_BY_REFERENCE,
      variables: {reference}
    });
  }

  createCustomer(customer: ICustomer) {
    return this.apollo.mutate<ICustomer>({
      mutation: CREATE_CUSTOMER,
      variables: { input: customer }
    });
  }

  createCustomers(customersInputs: [ICustomer]) {
    return this.apollo.mutate<any>({
      mutation: CREATE_CUSTOMERS,
      variables: { customersInputs }
    });
  }

  updateCustomer(reference: string, fields: any) {
    return this.apollo.mutate<ICustomer>({
      mutation: UPDATE_CUSTOMER,
      variables: { reference, fields }
    });
  }

  deleteCustomer(reference: string) {
    return this.apollo.mutate<boolean>({
      mutation: DELETE_CUSTOMER,
      variables: {reference}
    });
  }

  getEmptyCustomer():ICustomer {
    return {
      reference: '', title: '', name: '', surname: '', fullName: '', email: '', postcode: '', address: '', displayAddress: '', countryCode: '',
      phone: '',fullPhoneNumber: '',
      country: '',
      type: '',
      destination: '',
      location: '',
      registeredName: '',
      registeredNumber: '',
      role: ''
    };
  }

}
