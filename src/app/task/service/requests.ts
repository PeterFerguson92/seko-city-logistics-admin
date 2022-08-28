import { gql } from 'apollo-angular';

const TASK_FRAGMENT = gql`
      fragment taskfragment on Task {
        id title description actionDate status priority createdAt updateAt
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

export const GET_ACTIVE_TASKS = gql`
  query {
    activeTasks {
      ...taskfragment
    }
  }
  ${TASK_FRAGMENT}
`;

export const GET_APPROACHING_TASKS = gql`
  query {
    approachingTasks {
      ...taskfragment
    }
  }
  ${TASK_FRAGMENT}
`;

export const CREATE_TASK = gql`
  mutation createTask($task: TaskInput!) {
    createTask(task: $task) {
    ...taskfragment
    }
  }
  ${TASK_FRAGMENT}
`;

export const UPDATE_TASK = gql`
  mutation updateTask($id: Int!, $fields: [UpdateFieldInput!]) {
    updateTask(id: $id, fields: $fields) {
      ...taskfragment
    }
  }
  ${TASK_FRAGMENT}
`;

export const DELETE_TASK = gql`
  mutation deleteTask($id: Int!) {
    deleteTask(id: $id)
  }
`;





