import { gql } from 'apollo-angular';
export const SHIPMENT_FRAGMENT = gql`
    fragment shipmentfragment on Shipment {
        id
        reference
        portOfLoading
        portOfDischarge
        placeOfReceipt
        loadingDate
        consigneeName
        consigneeAddress
        exporterFullName
        exporterPostcode
        exporterAddress
        exporterArea
        exporterCity
        containerNumber
        blVessel
        shipmentDate
        status
        totalAmountCharged
        containerCharge
        containerExtraCharge
        loadersCost
        loadingExtraCost
        totalLoadingCost
        loadingCostNotes
        clearingCharge
        incentives
        totalGhDriversFood
        totalGhDriversTips
        thirdyPartyExpenses
        carToAccraCheckpoint
        carToKumasiCheckpoint
        carToOtherCheckpoint
        totalClearingCost
        clearingNotes
        totalExpenses
        profit
        notes
        archived
    }
`;
export const GET_ALL_SHIPMENTS = gql`
    query shipments($limit: Int!, $cursor: String) {
        shipments(limit: $limit, cursor: $cursor) {
            ...shipmentfragment
        }
    }
    ${SHIPMENT_FRAGMENT}
`;

export const GET_SHIPMENT_BY_REFERENCE = gql`
    query shipmentByReference($reference: String!) {
        shipmentByReference(reference: $reference) {
            ...shipmentfragment
        }
    }
    ${SHIPMENT_FRAGMENT}
`;

export const GET_SHIPMENT_BY_CONTAINER_NUMBER = gql`
    query shipmentByContainerNumber($containerNumber: String!) {
        shipmentByContainerNumber(containerNumber: $containerNumber) {
            ...shipmentfragment
        }
    }
    ${SHIPMENT_FRAGMENT}
`;

export const CREATE_SHIPMENT = gql`
    mutation createShipment($shipment: ShipmentInput!) {
        createShipment(shipment: $shipment) {
            ...shipmentfragment
        }
    }
    ${SHIPMENT_FRAGMENT}
`;

export const UPDATE_SHIPMENT = gql`
    mutation updateShipment($reference: String!, $fields: [UpdateFieldInput!]) {
        updateShipment(reference: $reference, fields: $fields) {
            ...shipmentfragment
        }
    }
    ${SHIPMENT_FRAGMENT}
`;

export const DELETE_SHIPMENT = gql`
    mutation deleteShipment($reference: String!) {
        deleteShipment(reference: $reference)
    }
`;
