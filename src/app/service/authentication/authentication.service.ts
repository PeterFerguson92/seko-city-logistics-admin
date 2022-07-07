import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import {
  DELETE_USER, GET_DRIVER, GET_DRIVERS, GET_KEY,
  IS_USER_AUTHENTICATED_QUERY, LOGIN_MUTATION, SIGN_UP_MUTATION, UPDATE_USER
} from './mutations';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {

  constructor(private apollo: Apollo) { }

  getDrivers() {
    return this.apollo.query<any>({
        query: GET_DRIVERS,
    });
  }

  getDriver(reference) {
    return this.apollo.query<any>({
      query: GET_DRIVER,
      variables: {reference}
    });
  }

  login(username: string, password: string) {
    return this.apollo.mutate<any>({
        mutation: LOGIN_MUTATION,
        variables: {
          input: { username, password },
        }
      });
  }

  signUp(input) {
    return this.apollo.mutate<any>({
      mutation: SIGN_UP_MUTATION,
      variables: { input }
    });
  }

  updateUser(username, fields) {
    return this.apollo.mutate<any>({
      mutation: UPDATE_USER,
      variables: { username, fields }
    });
  }

  deleteUser(username) {
    return this.apollo.mutate<any>({
      mutation: DELETE_USER,
      variables: { username }
    });
  }

  async isUserAuthenticated(sub: string) {
    const status: any = await this.apollo
      .query({
        query: IS_USER_AUTHENTICATED_QUERY,
        variables: {
          sub,
        }
      }).toPromise();
    return status.data.isUserAuthenticated;
  }

  getKeys() {
    return this.apollo.query<any>({
      query: GET_KEY,
    });
  }

}
