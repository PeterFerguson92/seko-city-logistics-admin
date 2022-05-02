import { gql } from 'apollo-angular';

export const GET_ITEMS_BY_SHIPMENT_REFERENCE = gql`
  query itemsByShipmentReference($shipmentReference: String!) {
    itemsByShipmentReference(shipmentReference: $shipmentReference) {
      id bookingReference shipmentReference quantity type description pricePerUnit value amount
    }
  }
`;




