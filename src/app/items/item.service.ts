import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import {
    FILTER_FULL_ITEMS,
    FILTER_ITEMS,
    GET_ELIGIBLE_ITEMS,
    GET_ITEMS_BY_BOOKING_REFERENCE,
    GET_ITEMS_BY_ORDER_REFERENCE,
    GET_ITEMS_BY_SHIPMENT_REFERENCE,
    GET_ITEMS_REPORT_DATA,
    SYNC_ORDER_ITEMS,
    UPDATE_ITEM,
    UPDATE_ITEMS_BY_BOOKING_REFERENCE,
    UPDATE_ITEMS_BY_ID,
} from './request';

@Injectable({
    providedIn: 'root',
})
export class ItemService {
    constructor(private apollo: Apollo) {}

    getItemsByShipmentReference(shipmentReference: string) {
        return this.apollo.query<any>({
            query: GET_ITEMS_BY_SHIPMENT_REFERENCE,
            variables: { shipmentReference },
        });
    }

    getItemsByBookingReference(bookingReference: string) {
        return this.apollo.query<any>({
            query: GET_ITEMS_BY_BOOKING_REFERENCE,
            variables: { bookingReference },
        });
    }

    getItemsByOrderReference(orderReference: string) {
        return this.apollo.query<any>({
            query: GET_ITEMS_BY_ORDER_REFERENCE,
            variables: { orderReference },
        });
    }

    getItemsReport() {
        return this.apollo.query<any>({
            query: GET_ITEMS_REPORT_DATA,
        });
    }

    getEligibleItems() {
        return this.apollo.query<any>({
            query: GET_ELIGIBLE_ITEMS,
        });
    }

    filterItems(fields: any) {
        return this.apollo.mutate<any>({
            mutation: FILTER_ITEMS,
            variables: { fields },
        });
    }

    filteredFullItems(fields: any) {
        return this.apollo.mutate<any>({
            mutation: FILTER_FULL_ITEMS,
            variables: { fields },
        });
    }

    updateItem(id: number, fields: any) {
        return this.apollo.mutate<any>({
            mutation: UPDATE_ITEM,
            variables: { id, fields },
        });
    }

    updateItemsById(ids: [number], fields: any) {
        return this.apollo.mutate<any>({
            mutation: UPDATE_ITEMS_BY_ID,
            variables: { ids, fields },
        });
    }

    updateItemsByBookingReference(bookingReference, fields: any) {
        return this.apollo.mutate<any>({
            mutation: UPDATE_ITEMS_BY_BOOKING_REFERENCE,
            variables: { bookingReference, fields },
        });
    }

    syncOrderItems(orderReference: string, items: any) {
        return this.apollo.mutate<any>({
            mutation: SYNC_ORDER_ITEMS,
            variables: { orderReference, items },
        });
    }
}
