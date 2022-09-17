import { gql } from 'apollo-angular';

export const BOOKING_FRAGMENT = gql`
      fragment bookingfragment on Booking {
        id reference senderReference senderFullName senderPhone receiverReferences destination location numberOfItems
      totalAmount amountPaid amountOutstanding discountAmount discountReason isDiscountApplied paymentType paymentStatus paymentNotes
      pickUpDate pickUpTime pickUpPostCode pickUpAddress
      updatesViaWhatsapp updatesViaEmail status shipmentReference assignedDriverReference assignedMatesReferences
    }
`;

export const GET_ALL_BOOKINGS = gql`
  query bookings($limit: Int!, $cursor: String) {
    bookings(limit:$limit, cursor: $cursor) {
      ...bookingfragment
    }
  }
  ${BOOKING_FRAGMENT}
`;

export const GET_BOOKINGS_BY_SENDER = gql`
  query bookingsBySender($senderReference: String!) {
    bookingsBySender(senderReference: $senderReference) {
     ...bookingfragment
    }
  }
  ${BOOKING_FRAGMENT}
`;

export const GET_BOOKING_BY_REFERENCE = gql`
  query bookingByReference($reference: String!) {
    bookingByReference(reference: $reference) {
     ...bookingfragment
    }
  }
  ${BOOKING_FRAGMENT}
`;

// completo
export const FILTER_BOOKINGS = gql`
  query filterBookings($fields: [UpdateFieldInput!]) {
    filterBookings(fields: $fields) {
      ...bookingfragment
    }
  }
  ${BOOKING_FRAGMENT}
`;

export const CREATE_BOOKING = gql`
  mutation createBooking($input: BookingInput!, $attachInvoice: Boolean!) {
    createBooking(input: $input, attachInvoice: $attachInvoice) {
      ...bookingfragment
    }
  }
  ${BOOKING_FRAGMENT}
`;

export const UPDATE_BOOKING = gql`
  mutation updateBooking($reference: String!, $fields: [UpdateFieldInput!], $attachInvoice: Boolean!) {
    updateBooking(reference: $reference, fields: $fields, attachInvoice: $attachInvoice) {
      ...bookingfragment
    }
  }
  ${BOOKING_FRAGMENT}
`;

export const UPDATE_BOOKING_STATUS = gql`
  mutation updateBookingStatus($reference: String!, $status: String!) {
    updateBookingStatus(reference: $reference, status: $status) {
      isInError
      errorMessage
      data { ...bookingfragment }
    }
  }
  ${BOOKING_FRAGMENT}
`;

export const UPDATE_BOOKING_ASSIGNED_DRIVER = gql`
  mutation updateBookingAssignedDriver($reference: String!, $assignedDriverReference: String!) {
    updateBookingAssignedDriver(reference: $reference, assignedDriverReference: $assignedDriverReference) {
      isInError
      errorMessage
      data { ...bookingfragment }
    }
  }
  ${BOOKING_FRAGMENT}
`;

export const UPDATE_ASSIGNED_MATES = gql`
  mutation updateMates($reference: String!, $assignedMatesReferences: [String!]) {
    updateMates(reference: $reference, assignedMatesReferences: $assignedMatesReferences) {
      isInError
      errorMessage
      data { ...bookingfragment }
    }
  }
  ${BOOKING_FRAGMENT}
`;

export const UPDATE_BOOKINGS_BY_REFERENCES = gql`
  mutation updateBookingsByReference($references: [String!]!, $fields: [UpdateFieldInput!]) {
    updateBookingsByReference(references: $references, fields: $fields)
  }
`;

export const SYNC_BOOKING = gql`
  mutation syncBooking($input: BookingInput!, $attachInvoice: Boolean!) {
    syncBooking(input: $input, attachInvoice: $attachInvoice)
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
      ...bookingfragment
    }
  }
  ${BOOKING_FRAGMENT}
`;

export const GET_BOOKINGS_DESTINATION_REPORT_DATA = gql`
  query {
  bookingsDestinationReport{ destination occurrence}
  }
`;

export const GET_BOOKINGS_REPORT_DATA = gql`
  query {
    bookingsReport{ totalAmount  total
      monthly {monthId monthName total totalAmount}}
  }
`;
