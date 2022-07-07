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
     users {sub email role status name lastName userName phoneNumber country reference}
    }
  }
`;

export const GET_DRIVER = gql`
  query getDriver($reference: String!){
    getDriver(reference:$reference) {
     errors { message }
     result
     users {sub email role status name lastName userName phoneNumber country reference}
    }
  }
`;

export const GET_KEY = gql`
  query {
    getKeys {
      googleMapsKey
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

