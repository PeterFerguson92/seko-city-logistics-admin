import { gql } from 'apollo-angular';

const ORDER_FRAGMENT = gql`
      fragment orderfragment on Order {
        id reference customerReference customerFullName customerPhone
        totalAmount amountPaid amountOutstanding paymentType paymentStatus paymentNotes
        deliveryDate deliveryTime deliveryPostCode deliveryAddress displayDeliveryAddress
        updatesViaWhatsapp  updatesViaEmail status archived
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

// export const CREATE_TASK = gql`
//   mutation createTask($task: TaskInput!) {
//     createTask(task: $task) {
//     ...taskfragment
//     }
//   }
//   ${TASK_FRAGMENT}
// `;

// export const UPDATE_TASK = gql`
//   mutation updateTask($id: Int!, $fields: [UpdateFieldInput!]) {
//     updateTask(id: $id, fields: $fields) {
//       ...taskfragment
//     }
//   }
//   ${TASK_FRAGMENT}
// `;

// export const DELETE_TASK = gql`
//   mutation deleteTask($id: Int!) {
//     deleteTask(id: $id)
//   }
// `;





