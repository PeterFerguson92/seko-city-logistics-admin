import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { IBooking, IBookingsResponse } from '../model';
import {
  CREATE_BOOKING, DELETE_BOOKING, FILTER_BOOKINGS, GET_ALL_BOOKINGS,
  GET_BOOKINGS_BY_STATUS_OR_SHIPMENT_REFERENCE,
  GET_BOOKING_BY_REFERENCE, GET_ITEMS_BY_BOOKING_REFERENCE, GET_PREVIOUS_RECEIVERS, SYNC_BOOKING,
  SYNC_ITEMS, SYNC_RECEIVERS, UPDATE_BOOKING
} from './request';

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

  updateBooking(reference: string, fields: any) {
    return this.apollo.mutate<IBooking>({
      mutation: UPDATE_BOOKING,
      variables: { reference, fields }
    });
  }

  syncBooking(booking: IBooking) {
    return this.apollo.mutate<IBooking>({
      mutation: SYNC_BOOKING,
      variables: { input: booking }
    });
  }

  syncReceivers(reference: string, receivers: any) {
    return this.apollo.mutate<any>({
      mutation: SYNC_RECEIVERS,
      variables: { reference, receivers }
    });
  }

  syncItems(bookingReference: string, items: any) {
    return this.apollo.mutate<any>({
      mutation: SYNC_ITEMS,
      variables: { bookingReference, items }
    });
  }

  deleteBooking(reference: string) {
    return this.apollo.mutate<boolean>({
      mutation: DELETE_BOOKING,
      variables: {reference}
    });
  }

  getItemsByBookingReference(bookingReference: string) {
    return this.apollo.query<any>({
      query: GET_ITEMS_BY_BOOKING_REFERENCE,
      variables: {bookingReference}
    });
  }

  getPreviousReceivers(senderReference: string) {
    return this.apollo.query<any>({
      query: GET_PREVIOUS_RECEIVERS,
      variables: {senderReference}
    });
  }

  getByStatusOrShipmentReference(status: string, shipmentReference: string) {
    return this.apollo.query<any>({
      query: GET_BOOKINGS_BY_STATUS_OR_SHIPMENT_REFERENCE,
      variables: {status, shipmentReference}
    });
  }
}
