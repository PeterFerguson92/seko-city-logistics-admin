import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { CURSOR, LIMIT } from 'src/app/constants';
import { CREATE_TASK, DELETE_TASK, GET_ACTIVE_TASKS, GET_ALL_TASKS, GET_APPROACHING_TASKS, UPDATE_TASK } from './requests';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private apollo: Apollo) { }

  getTasks() {
    return this.apollo.query<any>({
      query: GET_ALL_TASKS,
      variables: {
        limit: LIMIT, cursor: CURSOR,
      }
    });
  }

  getActiveTasks() {
    return this.apollo.query<any>({
      query: GET_ACTIVE_TASKS,
    });
  }

  getApproachingTasks() {
    return this.apollo.query<any>({
      query: GET_APPROACHING_TASKS,
    });
  }

  createTask(task: any) {
    return this.apollo.mutate<any>({
      mutation: CREATE_TASK,
      variables: { task }
    });
  }

  updateTask(id: number, fields: any) {
    return this.apollo.mutate<any>({
      mutation: UPDATE_TASK,
      variables: { id, fields }
    });
  }

  deleteTask(id: number) {
    return this.apollo.mutate<boolean>({
      mutation: DELETE_TASK,
      variables: {id}
    });
  }
}
