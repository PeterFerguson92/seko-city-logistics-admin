import { gql } from 'apollo-angular';

export const GET_ALL_CUSTOMERS = gql`
  query customers($limit: Int!, $cursor: String) {
    customers(limit:$limit, cursor: $cursor) {
      id fullName address postcode phone email country type uuid
    }
  }
`;

export interface CustomersResponse {
  customers: [Customer];
}

export interface Customer {
  id: number;
  uuid: string;
  fullName: string;
  address: string;
  postcode: string;
  phone: string;
  email: string;
  country: string;
  type: string;
  destination: string;
  // createdAt: Date;
  // updateAt: Date;
}
