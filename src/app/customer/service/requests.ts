import { gql } from 'apollo-angular';

export const GET_ALL_CUSTOMERS = gql`
  query customers($limit: Int!, $cursor: String) {
    customers(limit:$limit, cursor: $cursor) {
      id reference title name surname fullName email countryCode
      phone fullPhoneNumber postcode address displayAddress
      country type location destination role registeredName registeredNumber
    }
  }
`;

export const GET_CUSTOMER_BY_REFERENCE = gql`
  query customerByReference($reference: String!) {
    customerByReference(reference: $reference) {
      id reference title name surname fullName email countryCode
      phone fullPhoneNumber postcode address displayAddress
      country type location destination role registeredName registeredNumber
    }
  }
`;

export const GET_CUSTOMERS_BY_REFERENCES = gql`
  query customersByReferences($references: [String!]!) {
    customerByReference(reference: $reference) {
      id reference title name surname fullName email countryCode
      phone fullPhoneNumber postcode address displayAddress
      country type location destination role registeredName registeredNumber
    }
  }
`;

export const CREATE_CUSTOMER = gql`
  mutation createCustomer($input: CustomerInput!) {
    createCustomer(input: $input) {
      id reference title name surname fullName email countryCode
      phone fullPhoneNumber postcode address displayAddress
      country type location destination role registeredName registeredNumber
    }
  }
`;

export const UPDATE_CUSTOMER = gql`
  mutation createCustomer($reference: String!, $fields: [UpdateFieldInput!]) {
    updateCustomer(reference: $reference, fields: $fields) {
      id reference title name surname fullName email countryCode
      phone fullPhoneNumber postcode address displayAddress
      country type location destination role registeredName registeredNumber
    }
  }
`;

export const DELETE_CUSTOMER = gql`
  mutation deleteCustomer($reference: String!) {
    deleteCustomer(reference: $reference)
  }
`;


