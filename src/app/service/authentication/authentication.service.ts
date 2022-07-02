import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import {GET_DRIVERS, IS_USER_AUTHENTICATED_QUERY, LOGIN_MUTATION, SIGN_UP_MUTATION, UserResponse
} from './mutations';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {

  constructor(private apollo: Apollo) { }

  getDrivers() {
    return this.apollo.mutate<any>({
        mutation: GET_DRIVERS,
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
}
