import { gql } from 'apollo-angular';

export const GET_ALL_CUSTOMERS = gql`
  query customers($limit: Int!, $cursor: String) {
    customers(limit:$limit, cursor: $cursor) {
      id reference title name surname fullName email countryCode
      phone fullPhoneNumber postcode address displayAddress
      country type role registeredName registeredNumber
    }
  }
`;

export const GET_ALL_SENDER_CUSTOMERS = gql`
  query senderCustomers($limit: Int!, $cursor: String) {
    senderCustomers(limit:$limit, cursor: $cursor) {
      id reference title name surname fullName email countryCode
      phone fullPhoneNumber postcode address displayAddress
      country type role registeredName registeredNumber
    }
  }
`;

export const GET_CUSTOMER_BY_REFERENCE = gql`
  query customerByReference($reference: String!) {
    customerByReference(reference: $reference) {
      id reference title name surname fullName email countryCode
      phone fullPhoneNumber postcode address displayAddress
      country type role registeredName registeredNumber
    }
  }
`;

export const GET_CUSTOMERS_BY_REFERENCES = gql`
  query customersByReferences($references: [String!]!) {
    customersByReferences(references: $references) {
      id reference title name surname fullName email countryCode
      phone fullPhoneNumber postcode address displayAddress
      country type role registeredName registeredNumber
    }
  }
`;

export const GET_CUSTOMERS_REPORT = gql`
  query customerReport($reference: String!) {
    customerReport(reference: $reference) {
      items { type  occurrence quantity amount }
      bookings { destination occurrence }
      monthly {monthId  monthName total, totalAmount}
    }
  }
`;

export const CREATE_CUSTOMER = gql`
  mutation createCustomer($input: CustomerInput!) {
    createCustomer(input: $input) {
      id reference title name surname fullName email countryCode
      phone fullPhoneNumber postcode address displayAddress
      country type role registeredName registeredNumber
    }
  }
`;

export const CREATE_CUSTOMERS = gql`
  mutation createCustomers($customersInputs: [CustomerInput!]!) {
    createCustomers(customersInputs: $customersInputs) {
      id reference title name surname fullName email countryCode
      phone fullPhoneNumber postcode address displayAddress
      country type  role registeredName registeredNumber
    }
  }
`;

export const UPDATE_CUSTOMER = gql`
  mutation updateCustomer($reference: String!, $fields: [UpdateFieldInput!]) {
    updateCustomer(reference: $reference, fields: $fields) {
      id reference title name surname fullName email countryCode
      phone fullPhoneNumber postcode address displayAddress
      country type role registeredName registeredNumber
    }
  }
`;

export const DELETE_CUSTOMER = gql`
  mutation deleteCustomer($reference: String!) {
    deleteCustomer(reference: $reference)
  }
`;


