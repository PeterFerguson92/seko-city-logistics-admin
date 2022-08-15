import { gql } from 'apollo-angular';

const ORDER_FRAGMENT = gql`
      fragment orderfragment on Order {
        id reference customerReference customerFullName customerPhone
        totalAmount amountPaid amountOutstanding paymentType paymentStatus paymentNotes
        deliveryDate deliveryTime deliveryPostCode deliveryAddress displayDeliveryAddress
        updatesViaWhatsapp  updatesViaEmail status archived
      }
`;

export const GET_ALL_ORDERS = gql`
  query order($limit: Int!, $cursor: String) {
    orders(limit:$limit, cursor: $cursor) {
      ...orderfragment
    }
  }
  ${ORDER_FRAGMENT}
`;

export const GET_ORDER_BY_REFERENCE = gql`
  query orderByReference($reference: String!) {
    orderByReference(reference: $reference) {
      ...orderfragment
    }
  }
  ${ORDER_FRAGMENT}
`;

export const CREATE_ORDER = gql`
  mutation createOrder($order: OrderInput!) {
    createOrder(order: $order) {
    ...orderfragment
    }
  }
  ${ORDER_FRAGMENT}
`;

export const UPDATE_ORDER = gql`
  mutation updateOrder($reference: String!, $fields: [UpdateFieldInput!]) {
    updateOrder(reference: $reference, fields: $fields) {
      ...orderfragment
    }
  }
  ${ORDER_FRAGMENT}
`;

export const SYNC_ORDER = gql`
  mutation syncOrder($input: OrderInput!) {
    syncOrder(input: $input)
  }
`;

export const DELETE_ORDER = gql`
  mutation deleteOrder($reference: String!) {
    deleteOrder(reference: $reference)
  }
`;




