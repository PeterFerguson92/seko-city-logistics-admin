import { gql } from 'apollo-angular';

export const GET_ALL_BOOKINGS = gql`
  query bookings($limit: Int!, $cursor: String) {
    customers(limit:$limit, cursor: $cursor) {
      id reference senderReference senderPhone receiverReferences destination location numberOfItems
      totalAmount paymentType paymentStatus paymentNotes pickUpDate pickUpTime pickUpPostCode pickUpAddress
      updatesViaWhatsapp status shipmentReference assignedDriverReference
    }
  }
`;

export const GET_BOOKING_BY_REFERENCE = gql`
  query bookingByReference($reference: String!) {
    bookingByReference(reference: $reference) {
      id reference senderReference senderFullName senderPhone receiverReferences destination location numberOfItems
      totalAmount paymentType paymentStatus amountPaid amountOutstanding paymentNotes pickUpDate pickUpTime pickUpPostCode pickUpAddress
      updatesViaWhatsapp status shipmentReference assignedDriverReference
    }
  }
`;

// completo
export const FILTER_BOOKINGS = gql`
  query filterBookings($fields: [UpdateFieldInput!]) {
    filterBookings(fields: $fields) {
      id reference senderReference senderFullName senderPhone receiverReferences destination location numberOfItems
      totalAmount paymentType paymentStatus paymentNotes pickUpDate pickUpTime pickUpPostCode pickUpAddress
      updatesViaWhatsapp status shipmentReference assignedDriverReference
    }
  }
`;

export const CREATE_BOOKING = gql`
  mutation createBooking($input: BookingInput!) {
    createBooking(input: $input) {
      id reference senderReference senderFullName receiverReferences destination location numberOfItems
      totalAmount paymentType paymentStatus paymentNotes pickUpDate pickUpTime pickUpPostCode pickUpAddress
      updatesViaWhatsapp status shipmentReference assignedDriverReference
    }
  }
`;

export const UPDATE_BOOKING = gql`
  mutation updateBooking($reference: String!, $fields: [UpdateFieldInput!]) {
    updateBooking(reference: $reference, fields: $fields) {
      id reference senderReference senderFullName receiverReferences destination location numberOfItems
      totalAmount paymentType paymentStatus paymentNotes pickUpDate pickUpTime pickUpPostCode pickUpAddress
      updatesViaWhatsapp status shipmentReference assignedDriverReference
    }
  }
`;

export const UPDATE_BOOKINGS_BY_REFERENCES = gql`
  mutation updateBookingsByReference($references: [String!]!, $fields: [UpdateFieldInput!]) {
    updateBookingsByReference(references: $references, fields: $fields)
  }
`;

export const SYNC_BOOKING = gql`
  mutation syncBooking($input: BookingInput!) {
    syncBooking(input: $input)
  }
`;

export const SYNC_RECEIVERS = gql`
  mutation syncReceivers($reference: String!, $receivers: [CustomerInput!]) {
    syncReceivers(reference: $reference, receivers: $receivers)
  }
`;

export const SYNC_ITEMS = gql`
  mutation syncItems($bookingReference: String!, $items: [ItemInput!]) {
    syncItems(bookingReference: $bookingReference, items: $items)
  }
`;

export const DELETE_BOOKING = gql`
  mutation deleteBooking($reference: String!) {
    deleteBooking(reference: $reference)
  }
`;

export const ARCHIVE_UNARCHIVE_BOOKING = gql`
  mutation archiveUnarchiveBooking($reference: String!, $value: Boolean!) {
    archiveUnarchiveBooking(reference: $reference, value: $value)
  }
`;

export const GET_ITEMS_BY_BOOKING_REFERENCE = gql`
  query itemsByBookingReference($bookingReference: String!) {
    itemsByBookingReference(bookingReference: $bookingReference) {
      id bookingReference quantity type description pricePerUnit value amount
    }
  }
`;

export const GET_PREVIOUS_RECEIVERS = gql`
  query previousReceiversBySender($senderReference: String!) {
    previousReceiversBySender(senderReference: $senderReference) {
      id reference title name surname fullName email countryCode phone
      fullPhoneNumber postcode address displayAddress country type role registeredName registeredNumber
    }
  }
`;


export const GET_BOOKINGS_BY_STATUS_OR_SHIPMENT_REFERENCE = gql`
  query bookingsByStatusOrShipmentReference($status: String!, $shipmentReference: String!) {
    bookingsByStatusOrShipmentReference(status: $status, shipmentReference:$shipmentReference) {
      id reference senderReference senderFullName receiverReferences destination location numberOfItems
      totalAmount paymentType paymentStatus paymentNotes pickUpDate pickUpTime pickUpPostCode pickUpAddress
      updatesViaWhatsapp status shipmentReference assignedDriverReference
    }
  }
`;

export const GET_BOOKINGS_DESTINATION_REPORT_DATA = gql`
  query {
  bookingsDestinationReport{ destination occurrence}
  }
`;
