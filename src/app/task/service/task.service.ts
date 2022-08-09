import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { CURSOR, LIMIT } from 'src/app/constants';
import { GET_ALL_TASKS } from './requests';

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
}
