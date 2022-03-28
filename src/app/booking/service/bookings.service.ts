import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { UPDATE_CUSTOMER } from 'src/app/customer/service/requests';
import { IBooking, IBookingsResponse } from '../model';
import { CREATE_BOOKING, DELETE_BOOKING, FILTER_BOOKINGS, GET_ALL_BOOKINGS, GET_BOOKING_BY_REFERENCE, UPDATE_BOOKING } from './request';

const LIMIT = 100
const CURSOR = null;

@Injectable({
  providedIn: 'root'
})
export class BookingsService {

  constructor(private apollo: Apollo) { }

  getBookings() {
    return this.apollo.query<IBookingsResponse>({
      query: GET_ALL_BOOKINGS,
      variables: {
        limit: LIMIT, cursor: CURSOR,
      }
    });
  }

  getBookingByReference(reference: string) {
    return this.apollo.query<any>({
      query: GET_BOOKING_BY_REFERENCE,
      variables: {reference}
    });
  }

  filterBookings(fields: any) {
    return this.apollo.mutate<IBookingsResponse>({
      mutation: FILTER_BOOKINGS,
      variables: { fields }
    });
  }

  createBooking(booking: IBooking) {
    return this.apollo.mutate<IBooking>({
      mutation: CREATE_BOOKING,
      variables: { input: booking }
    });
  }

  updateCustomer(reference: string, fields: any) {
    return this.apollo.mutate<IBooking>({
      mutation: UPDATE_CUSTOMER,
      variables: { reference, fields }
    });
  }

  deleteBooking(reference: string) {
    return this.apollo.mutate<boolean>({
      mutation: DELETE_BOOKING,
      variables: {reference}
    });
  }
}
