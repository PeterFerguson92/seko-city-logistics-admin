import { gql } from 'apollo-angular';

export const GET_ADDRESSES_BY_POSTCODE = gql`
query addresses($postcode: String!) {
  addressesInfo(postcode: $postcode) {
    latitude, longitude, addresses
  }
}
`;
