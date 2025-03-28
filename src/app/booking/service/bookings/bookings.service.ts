import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { IBooking, IBookingsResponse } from '../../model';
import {
    ARCHIVE_UNARCHIVE_BOOKING,
    CREATE_BOOKING,
    DELETE_BOOKING,
    FILTER_BOOKINGS,
    GET_ALL_BOOKINGS,
    GET_BOOKINGS_BY_SENDER,
    GET_BOOKINGS_BY_STATUS_OR_SHIPMENT_REFERENCE,
    GET_BOOKINGS_DESTINATION_REPORT_DATA,
    GET_BOOKINGS_REPORT_DATA,
    GET_BOOKING_BY_REFERENCE,
    GET_PREVIOUS_RECEIVERS,
    SYNC_BOOKING,
    SYNC_ITEMS,
    SYNC_RECEIVERS,
    UPDATE_ASSIGNED_MATES,
    UPDATE_BOOKING,
    UPDATE_BOOKINGS_BY_REFERENCES,
    UPDATE_BOOKING_ASSIGNED_DRIVER,
    UPDATE_BOOKING_STATUS,
} from './request';

const LIMIT = 100;
const CURSOR = null;

@Injectable({
    providedIn: 'root',
})
export class BookingsService {
    constructor(private apollo: Apollo) {}

    getBookings() {
        return this.apollo.query<any>({
            query: GET_ALL_BOOKINGS,
            variables: {
                limit: LIMIT,
                cursor: CURSOR,
            },
        });
    }

    getBookingsBySender(senderReference: string) {
        return this.apollo.query<any>({
            query: GET_BOOKINGS_BY_SENDER,
            variables: { senderReference },
        });
    }

    getBookingByReference(reference: string) {
        return this.apollo.query<any>({
            query: GET_BOOKING_BY_REFERENCE,
            variables: { reference },
        });
    }

    filterBookings(fields: any) {
        return this.apollo.mutate<any>({
            mutation: FILTER_BOOKINGS,
            variables: { fields },
        });
    }

    createBooking(booking: any, attachInvoice: boolean, isPending: boolean) {
        return this.apollo.mutate<IBooking>({
            mutation: CREATE_BOOKING,
            variables: { input: booking, attachInvoice, isPending },
        });
    }

    updateBooking(reference: string, fields: any, attachInvoice: boolean) {
        return this.apollo.mutate<IBooking>({
            mutation: UPDATE_BOOKING,
            variables: { reference, fields, attachInvoice },
        });
    }

    updateBookingStatus(reference: string, status: string) {
        return this.apollo.mutate<any>({
            mutation: UPDATE_BOOKING_STATUS,
            variables: { reference, status },
        });
    }

    updateBookingAssignedDriver(reference: string, assignedDriverReference: string) {
        return this.apollo.mutate<any>({
            mutation: UPDATE_BOOKING_ASSIGNED_DRIVER,
            variables: { reference, assignedDriverReference },
        });
    }

    updateBookingsByReferences(references: [string], fields: any) {
        return this.apollo.mutate<any>({
            mutation: UPDATE_BOOKINGS_BY_REFERENCES,
            variables: { references, fields },
        });
    }

    syncBooking(booking: any, attachInvoice: boolean) {
        return this.apollo.mutate<IBooking>({
            mutation: SYNC_BOOKING,
            variables: { input: booking, attachInvoice },
        });
    }

    syncReceivers(reference: string, receivers: any) {
        return this.apollo.mutate<any>({
            mutation: SYNC_RECEIVERS,
            variables: { reference, receivers },
        });
    }

    syncItems(bookingReference: string, items: any) {
        return this.apollo.mutate<any>({
            mutation: SYNC_ITEMS,
            variables: { bookingReference, items },
        });
    }

    updateMates(reference: string, assignedMatesReferences: any) {
        return this.apollo.mutate<any>({
            mutation: UPDATE_ASSIGNED_MATES,
            variables: { reference, assignedMatesReferences },
        });
    }

    deleteBooking(reference: string) {
        return this.apollo.mutate<boolean>({
            mutation: DELETE_BOOKING,
            variables: { reference },
        });
    }

    archiveUnarchiveBooking(reference: string, value: boolean) {
        return this.apollo.mutate<boolean>({
            mutation: ARCHIVE_UNARCHIVE_BOOKING,
            variables: { reference, value },
        });
    }

    getPreviousReceivers(senderReference: string) {
        return this.apollo.query<any>({
            query: GET_PREVIOUS_RECEIVERS,
            variables: { senderReference },
        });
    }

    getByStatusOrShipmentReference(status: string, shipmentReference: string) {
        return this.apollo.query<any>({
            query: GET_BOOKINGS_BY_STATUS_OR_SHIPMENT_REFERENCE,
            variables: { status, shipmentReference },
        });
    }

    getBookingsDestinationReport() {
        return this.apollo.query<any>({
            query: GET_BOOKINGS_DESTINATION_REPORT_DATA,
        });
    }

    getBookingsReport() {
        return this.apollo.query<any>({
            query: GET_BOOKINGS_REPORT_DATA,
        });
    }

    processDisplayItems(items) {
        const displayItemList = [];
        let index;
        items.forEach((item: any) => {
            if (item.type !== 'OTHER') {
                index = displayItemList.findIndex((obj: any) => {
                    return obj.type === item.type && obj.value.toString() === item.value.toString();
                });
            } else {
                index = displayItemList.findIndex((obj: any) => {
                    return (
                        obj.type === item.type &&
                        obj.value.toString() === item.value.toString() &&
                        obj.description === item.description
                    );
                });
            }
            if (index > -1) {
                const newqty = displayItemList[index].quantity + item.quantity;
                const newObj = { ...item, quantity: newqty, amount: newqty * item.pricePerUnit };
                displayItemList[index] = newObj;
            } else {
                const newObj = { ...item, quantity: 1, amount: item.pricePerUnit };
                displayItemList.push(newObj);
            }
        });
        return displayItemList;
    }
}
