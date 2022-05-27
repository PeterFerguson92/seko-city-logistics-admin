import { gql } from 'apollo-angular';


export const GET_ITEMS_BY_SHIPMENT_REFERENCE = gql`
  query itemsByShipmentReference($shipmentReference: String!) {
    itemsByShipmentReference(shipmentReference: $shipmentReference) {
      id bookingReference shipmentReference quantity type description pricePerUnit value amount status
    }
  }
`;

export const GET_ITEMS_BY_BOOKING_REFERENCE = gql`
  query itemsByBookingReference($bookingReference: String!) {
    itemsByBookingReference(bookingReference: $bookingReference) {
      id bookingReference shipmentReference quantity type description pricePerUnit value amount status
    }
  }
`;

export const GET_ELIGIBLE_ITEMS = gql`
query {
  eligibleItems {
    item { id bookingReference shipmentReference quantity type description pricePerUnit value amount status},
    booking { id reference senderReference senderFullName receiverReferences destination location numberOfItems
      totalAmount paymentType paymentStatus paymentNotes pickUpDate pickUpTime pickUpPostCode pickUpAddress
      updatesViaWhatsapp status shipmentReference assignedDriverReference }
  }
}
`;

export const GET_ITEMS_REPORT_DATA = gql`
  query {
    itemsDestinationReport{ type  occurrence quantity amount}
  }
`;

export const FILTER_ITEMS = gql`
  query filterItems($fields: [UpdateFieldInput!]) {
    filterItems(fields: $fields) {
      id bookingReference shipmentReference quantity type description pricePerUnit value amount status
    }
  }
`;

export const FILTER_FULL_ITEMS = gql`
  query filterItems($fields: [FieldInput!]) {
    filteredFullItems(fields: $fields) {
    item { id bookingReference shipmentReference quantity type description pricePerUnit value amount status},
    booking { id reference senderReference senderFullName receiverReferences destination location numberOfItems
      totalAmount paymentType paymentStatus paymentNotes pickUpDate pickUpTime pickUpPostCode pickUpAddress
      updatesViaWhatsapp status shipmentReference assignedDriverReference }
    }
  }
`;

export const UPDATE_ITEM = gql`
  mutation updateItem($id: Int!, $fields: [UpdateFieldInput!]) {
    updateItem(id: $id, fields: $fields) {
      id bookingReference shipmentReference type quantity amount description value pricePerUnit status
    }
  }
`;

export const UPDATE_ITEMS_BY_ID = gql`
  mutation updateItem($ids: [Int!]!, $fields: [UpdateFieldInput!]) {
    updateItemsByIds(ids: $ids, fields: $fields)
  }
`;
