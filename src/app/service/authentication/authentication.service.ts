import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { CommonService } from '../common.service';
import {
    CHANGE_PASSWORD_MUTATION,
    CONFIRM_RESET_PASSWORD_MUTATION,
    DELETE_USER,
    GET_DRIVER,
    GET_DRIVERS,
    GET_USER,
    IS_USER_AUTHENTICATED_QUERY,
    LOGIN_MUTATION,
    LOGOUT,
    RESET_PASSWORD_MUTATION,
    SIGN_UP_MUTATION,
    UPDATE_USER,
} from './mutations';

@Injectable({
    providedIn: 'root',
})
export class AuthenticationService {
    constructor(private apollo: Apollo, private commonService: CommonService) {}

    getUser(sub) {
        console.log(sub);
        return this.apollo.query<any>({
            query: GET_USER,
            variables: { sub },
        });
    }

    getDrivers() {
        return this.apollo.query<any>({
            query: GET_DRIVERS,
        });
    }

    getDriver(reference) {
        return this.apollo.query<any>({
            query: GET_DRIVER,
            variables: { reference },
        });
    }

    login(username: string, password: string) {
        return this.apollo.mutate<any>({
            mutation: LOGIN_MUTATION,
            variables: {
                input: { username, password },
            },
        });
    }

    signUp(input) {
        return this.apollo.mutate<any>({
            mutation: SIGN_UP_MUTATION,
            variables: { input },
        });
    }

    changePassword(username: string, oldPassword: string, newPassword: string) {
        return this.apollo.mutate<any>({
            mutation: CHANGE_PASSWORD_MUTATION,
            variables: { username, oldPassword, newPassword },
        });
    }

    resetPassword(username: string) {
        return this.apollo.mutate<any>({
            mutation: RESET_PASSWORD_MUTATION,
            variables: { username },
        });
    }

    confirmResetPassword(username: string, verificationCode: string, newPassword: string) {
        return this.apollo.mutate<any>({
            mutation: CONFIRM_RESET_PASSWORD_MUTATION,
            variables: { username, verificationCode, newPassword },
        });
    }

    updateUser(username, fields) {
        return this.apollo.mutate<any>({
            mutation: UPDATE_USER,
            variables: { username, fields },
        });
    }

    deleteUser(username) {
        return this.apollo.mutate<any>({
            mutation: DELETE_USER,
            variables: { username },
        });
    }

    async isUserAuthenticated(key: string) {
        const status: any = await this.apollo
            .query({
                query: IS_USER_AUTHENTICATED_QUERY,
                variables: {
                    username: key,
                },
            })
            .toPromise();
        return status.data.isUserAuthenticated;
    }

    async logout(key: string) {
        const status: any = await this.apollo
            .mutate({
                mutation: LOGOUT,
                variables: {
                    username: key,
                },
            })
            .toPromise();
        return status.data.logout;
    }
}
