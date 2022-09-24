import { gql } from 'apollo-angular';

export const ORDER_FRAGMENT = gql`
      fragment orderfragment on Order {
        id reference customerReference customerFullName customerPhone
        totalAmount amountPaid amountOutstanding paymentType paymentStatus paymentNotes
        deliveryDate deliveryTime deliveryPostCode deliveryAddress
        updatesViaWhatsapp updatesViaEmail status archived assignedDriverReference createdAt numberOfItems
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

export const FILTER_ORDERS = gql`
  query filterOrders($fields: [UpdateFieldInput!]) {
    filterOrders(fields: $fields) {
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

export const UPDATE_ORDER_STATUS = gql`
  mutation updateOrderStatus($reference: String!, $status: String!) {
    updateOrderStatus(reference: $reference, status: $status) {
      ...orderfragment
    }
  }
  ${ORDER_FRAGMENT}
`;

export const UPDATE_ORDER_ASSIGNED_DRIVER = gql`
  mutation updateOrderAssignedDriver($reference: String!, $assignedDriverReference: String!) {
    updateOrderAssignedDriver(reference: $reference, assignedDriverReference: $assignedDriverReference) {
      isInError
      errorMessage
      data { ...orderfragment }
    }
  }
  ${ORDER_FRAGMENT}
`;

export const UPDATE_ORDERS_BY_REFERENCES = gql`
  mutation updateOrdersByReference($references: [String!]!, $fields: [UpdateFieldInput!]) {
    updateOrdersByReference(references: $references, fields: $fields)
  }
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

export const GET_ORDERS_REPORT_DATA = gql`
  query {
    ordersReport { totalAmount total
      monthly {monthId monthName total totalAmount}
      }
  }
`;


