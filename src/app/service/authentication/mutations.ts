import { gql } from 'apollo-angular';

export const LOGIN_MUTATION = gql`
  mutation login( $input: LoginInput!) {
    login(input: $input) {
      errors { message }
      result
      userData {sub, email}
    }
  }
`;

export const SIGN_UP_MUTATION = gql`
  mutation signUp($input: SignUpInput!) {
    signUp(input: $input) {
      errors { message }
      result
      userData {sub, email}
    }
  }
`;


export const CHANGE_PASSWORD_MUTATION = gql`
  mutation changePassword($username: String!, $oldPassword: String!, $newPassword: String!) {
    changePassword(username: $username, oldPassword: $oldPassword, newPassword: $newPassword ) {
      errors { message }
      result
    }
  }
`;

export const RESET_PASSWORD_MUTATION = gql`
  mutation resetPassword($username: String!) {
    resetPassword(username: $username) {
      errors { message }
      result
    }
  }
`;

export const CONFIRM_RESET_PASSWORD_MUTATION = gql`
  mutation confirmResetPassword($username: String!, $verificationCode: String!, $newPassword: String!) {
    confirmResetPassword(username: $username, verificationCode: $verificationCode, newPassword: $newPassword) {
      errors { message }
      result
    }
  }
`;

export const GET_USER = gql`
  query getUser($sub: String!){
    getUser(sub:$sub) {
     errors { message }
     result
     users {sub email role status name lastName username phoneNumber country reference}
    }
  }
`;

export const UPDATE_USER = gql`
  mutation updateUser($username: String!, $fields: [UpdateFieldInput!]) {
    updateUser(username:$username, fields:$fields)
  }
`;

export const DELETE_USER = gql`
  mutation deleteUser($username: String!) {
    deleteUser(username:$username)
  }
`;

export const IS_USER_AUTHENTICATED_QUERY = gql`
  query isUserAuthenticated($sub: String!) {
    isUserAuthenticated(sub: $sub)
  }
`;

export const GET_DRIVERS = gql`
  query {
    getDrivers {
     errors { message }
     result
     users {sub email role status name lastName username phoneNumber country reference}
    }
  }
`;

export const GET_DRIVER = gql`
  query getDriver($reference: String!){
    getDriver(reference:$reference) {
     errors { message }
     result
     users {sub email role status name lastName username phoneNumber country reference}
    }
  }
`;

export interface UserResponse {
  signUp: SignUp;
}

interface SignUp {
  errors: FieldError[];
  result: boolean;
  userData: UserData;
}

interface UserData {
  sub: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  pictureUrl: string;
  role: string;
  status: string;
  username: string;
}

interface FieldError {
  message: string;
}

