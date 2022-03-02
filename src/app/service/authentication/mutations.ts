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
  mutation signUp( $input: SignUpInput!) {
    signUp(input: $input) {
      errors { message }
      result
      userData {sub, email}
    }
  }
`;

export const IS_USER_AUTHENTICATED_QUERY = gql`
  query isUserAuthenticated($sub: String!) {
    isUserAuthenticated(sub: $sub)
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
