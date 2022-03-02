import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import {IS_USER_AUTHENTICATED_QUERY, LOGIN_MUTATION, SIGN_UP_MUTATION, UserResponse
} from './mutations';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {

  constructor(private apollo: Apollo) { }

  login(username: string, password: string) {
    return this.apollo.mutate<UserResponse>({
        mutation: LOGIN_MUTATION,
        variables: {
          input: { username, password },
        }
      });
  }

  async signUp(username: string, role:string, email: string, password: string) {
    return this.apollo.mutate<UserResponse>({
      mutation: SIGN_UP_MUTATION,
      variables: {
        input: {username, email, role, password },
      }
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
