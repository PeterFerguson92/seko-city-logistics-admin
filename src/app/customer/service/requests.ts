import { gql } from 'apollo-angular';

export const GET_ALL_CUSTOMERS = gql`
  query customers($limit: Int!, $cursor: String) {
    customers(limit:$limit, cursor: $cursor) {
      id fullName address postcode phone email country type uuid
    }
  }
`;

export const GET_CUSTOMER_BY_REFERENCE = gql`
  query customers($reference: String) {
    customerByReference(reference: $reference) {
      id fullName address postcode phone email country type uuid
    }
  }
`;

export const CREATE_CUSTOMER = gql`
  mutation createCustomer($input: CustomerInput!) {
    createCustomer(input: $input) {
      id fullName address postcode phone email country type uuid
    }
  }
`;

export const UPDATE_CUSTOMER = gql`
  mutation createCustomer($reference: String) {
    createCustomer(reference: $reference) {
      id fullName address postcode phone email country type uuid
    }
  }
`;

export const DELETE_CUSTOMER = gql`
  mutation deleteCustomer($reference: String!) {
    deleteCustomer(reference: $reference)
  }
`;


