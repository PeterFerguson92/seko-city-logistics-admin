import { gql } from 'apollo-angular';

const TASK_FRAGMENT = gql`
      fragment taskfragment on Task {
        id description actionDate status createdAt updateAt
      }
   `;

export const GET_ALL_TASKS = gql`
  query tasks($limit: Int!, $cursor: String) {
    tasks(limit:$limit, cursor: $cursor) {
      ...taskfragment
    }
  }
  ${TASK_FRAGMENT}
`;

// export const GET_SHIPMENT_BY_REFERENCE = gql`
//   query shipmentByReference($reference: String!) {
//     shipmentByReference(reference: $reference) {
//       id reference,portOfLoading,portOfDischarge,
//      placeOfReceipt, loadingDate consigneeName, consigneeAddress, exporterFullName,exporterPostcode
//      exporterAdress, exporterArea, exporterCity, containerNumber, blVessel,shipmentDate, status,
//     totalAmountCharged, containerCharge, containerExtraCharge, loadersCost, loadingExtraCost, totalLoadingCost, loadingCostNotes,
//     clearingCharge, incentives, totalGhDriversFood, totalGhDriversTips,
//     thirdyPartyExpenses, carToAccraCheckpoint,carToKumasiCheckpoint, carToOtherCheckpoint, totalClearingCost,
//     clearingNotes, totalExpenses, profit, notes, archived
//     }
//   }
// `;

// export const GET_SHIPMENT_BY_CONTAINER_NUMBER = gql`
//   query shipmentByContainerNumber($containerNumber: String!) {
//     shipmentByContainerNumber(containerNumber: $containerNumber) {
//       id reference,portOfLoading,portOfDischarge,
//      placeOfReceipt, loadingDate consigneeName, consigneeAddress, exporterFullName,exporterPostcode
//      exporterAdress, exporterArea, exporterCity, containerNumber, blVessel,shipmentDate, status,
//     totalAmountCharged, containerCharge, containerExtraCharge, loadersCost, loadingExtraCost, totalLoadingCost, loadingCostNotes,
//     clearingCharge, incentives, totalGhDriversFood, totalGhDriversTips,
//     thirdyPartyExpenses, carToAccraCheckpoint,carToKumasiCheckpoint, carToOtherCheckpoint, totalClearingCost,
//     clearingNotes, totalExpenses, profit, notes, archived
//     }
//   }
// `;

// export const CREATE_SHIPMENT = gql`
//   mutation createShipment($shipment: ShipmentInput!) {
//     createShipment(shipment: $shipment) {
//     id reference,portOfLoading,portOfDischarge,
//      placeOfReceipt, loadingDate consigneeName, consigneeAddress, exporterFullName,exporterPostcode
//      exporterAdress, exporterArea, exporterCity, containerNumber, blVessel,shipmentDate, status,
//     totalAmountCharged, containerCharge, containerExtraCharge, loadersCost, loadingExtraCost, totalLoadingCost, loadingCostNotes,
//     clearingCharge, incentives, totalGhDriversFood, totalGhDriversTips,
//     thirdyPartyExpenses, carToAccraCheckpoint,carToKumasiCheckpoint, carToOtherCheckpoint, totalClearingCost,
//     clearingNotes, totalExpenses, profit, notes, archived
//     }
//   }
// `;


// export const UPDATE_SHIPMENT = gql`
//   mutation updateShipment($reference: String!, $fields: [UpdateFieldInput!]) {
//     updateShipment(reference: $reference, fields: $fields) {
//       id reference,portOfLoading,portOfDischarge,
//      placeOfReceipt, loadingDate consigneeName, consigneeAddress, exporterFullName,exporterPostcode
//      exporterAdress, exporterArea, exporterCity, containerNumber, blVessel,shipmentDate, status,
//     totalAmountCharged, containerCharge, containerExtraCharge, loadersCost, loadingExtraCost, totalLoadingCost, loadingCostNotes,
//     clearingCharge, incentives, totalGhDriversFood, totalGhDriversTips,
//     thirdyPartyExpenses, carToAccraCheckpoint,carToKumasiCheckpoint, carToOtherCheckpoint, totalClearingCost,
//     clearingNotes, totalExpenses, profit, notes, archived
//     }
//   }
// `;

// export const DELETE_SHIPMENT = gql`
//   mutation deleteShipment($reference: String!) {
//     deleteShipment(reference: $reference)
//   }
// `;


