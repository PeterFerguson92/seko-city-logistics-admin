import { gql } from 'apollo-angular';
import { BOOKING_FRAGMENT } from '../booking/service/bookings/request';
import { ORDER_FRAGMENT } from '../order/service/requests';

export const GET_ADDRESSES_BY_POSTCODE = gql`
query addresses($postcode: String!) {
  addressesInfo(postcode: $postcode) {
    latitude, longitude, addresses
  }
}
`;

export const GET_ACTIVITY_AVAILABILITY = gql`
query activityAvailability($date: String!) {
  activityAvailability(date: $date) {
    bookings {
        ...bookingfragment
    }
    orders {
      ...orderfragment
    }
  }
}
${BOOKING_FRAGMENT}
${ORDER_FRAGMENT}
`;
