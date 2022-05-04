import { gql } from 'apollo-angular';


export const GET_ITEMS_BY_BOOKING_REFERENCE = gql`
  query itemsByBookingReference($bookingReference: String!) {
    itemsByBookingReference(bookingReference: $bookingReference) {
      id bookingReference quantity type description pricePerUnit value amount
    }
  }
`;
export const GET_ITEMS_BY_SHIPMENT_REFERENCE = gql`
  query itemsByShipmentReference($shipmentReference: String!) {
    itemsByShipmentReference(shipmentReference: $shipmentReference) {
      id bookingReference shipmentReference quantity type description pricePerUnit value amount
    }
  }
`;

export const GET_ITEMS_REPORT_DATA = gql`
  query {
    itemsDestinationReport{ type  occurrence quantity amount}
  }
`;


