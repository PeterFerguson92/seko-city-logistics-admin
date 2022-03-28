import { gql } from 'apollo-angular';

export const GET_ALL_BOOKINGS = gql`
  query bookings($limit: Int!, $cursor: String) {
    customers(limit:$limit, cursor: $cursor) {
      id reference senderReference receiverReferences destination location numberOfItems
      totalAmount paymentType paymentStatus paymentNotes pickUpDate  pickUpPostCode pickUpAddress
      updatesViaWhatsapp status shipmentReference assignedDriverReference
    }
  }
`;

export const GET_BOOKING_BY_REFERENCE = gql`
  query bookingByReference($reference: String!) {
    bookingByReference(reference: $reference) {
      id reference senderReference senderFullName receiverReferences destination location numberOfItems
      totalAmount paymentType paymentStatus paymentNotes pickUpDate  pickUpPostCode pickUpAddress
      updatesViaWhatsapp status shipmentReference assignedDriverReference
    }
  }
`;

export const FILTER_BOOKINGS = gql`
  query filterBookings($fields: [UpdateFieldInput!]) {
    filterBookings(fields: $fields) {
      id reference senderReference senderFullName receiverReferences destination location numberOfItems
      totalAmount paymentType paymentStatus paymentNotes pickUpDate  pickUpPostCode pickUpAddress
      updatesViaWhatsapp status shipmentReference assignedDriverReference
    }
  }
`;

export const CREATE_BOOKING = gql`
  mutation createBooking($input: BookingInput!) {
    createBooking(input: $input) {
      id reference senderReference senderFullName receiverReferences destination location numberOfItems
      totalAmount paymentType paymentStatus paymentNotes pickUpDate  pickUpPostCode pickUpAddress
      updatesViaWhatsapp status shipmentReference assignedDriverReference
    }
  }
`;

export const UPDATE_BOOKING = gql`
  mutation updateBooking($reference: String!, $fields: [UpdateFieldInput!]) {
    updateBooking(reference: $reference, fields: $fields) {
      id reference senderReference senderFullName receiverReferences destination location numberOfItems
      totalAmount paymentType paymentStatus paymentNotes pickUpDate  pickUpPostCode pickUpAddress
      updatesViaWhatsapp status shipmentReference assignedDriverReference
    }
  }
`;

export const DELETE_BOOKING = gql`
  mutation deleteBooking($reference: String!) {
    deleteBooking(reference: $reference)
  }
`;
