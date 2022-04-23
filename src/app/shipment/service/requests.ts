import { gql } from 'apollo-angular';

export const GET_ALL_SHIPMENTS = gql`
  query shipments($limit: Int!, $cursor: String) {
    shipments(limit:$limit, cursor: $cursor) {
     id reference,portOfLoading,portOfDischarge, placeOfReceipt, loadingDate consigneeName, consigneeAddress,
     exporterFullName, exporterPostcode, exporterAdress, exporterArea, exporterCity, containerNumber, blVessel, shipmentDate, status, archived
    }
  }
`;

export const GET_SHIPMENT_BY_REFERENCE = gql`
  query shipmentByReference($reference: String!) {
    shipmentByReference(reference: $reference) {
      id reference,portOfLoading,portOfDischarge, placeOfReceipt, loadingDate consigneeName, consigneeAddress,
      exporterFullName, exporterPostcode, exporterAdress, exporterArea, exporterCity, containerNumber, blVessel, shipmentDate, status, archived
    }
  }
`;


export const CREATE_SHIPMENT = gql`
  mutation createShipment($shipment: ShipmentInput!) {
    createShipment(shipment: $shipment) {
      id reference,portOfLoading,portOfDischarge, placeOfReceipt, loadingDate consigneeName, consigneeAddress,
      exporterFullName, exporterPostcode, exporterAdress, exporterArea, exporterCity, containerNumber, blVessel, shipmentDate, status, archived
    }
  }
`;


export const UPDATE_SHIPMENT = gql`
  mutation updateShipment($reference: String!, $fields: [UpdateFieldInput!]) {
    updateShipment(reference: $reference, fields: $fields) {
      id reference,portOfLoading,portOfDischarge, placeOfReceipt, loadingDate consigneeName, consigneeAddress,
     exporterFullName, exporterPostcode, exporterAdress, exporterArea, exporterCity, containerNumber, blVessel, shipmentDate, status, archived
    }
  }
`;

export const DELETE_SHIPMENT = gql`
  mutation deleteShipment($reference: String!) {
    deleteShipment(reference: $reference)
  }
`;


