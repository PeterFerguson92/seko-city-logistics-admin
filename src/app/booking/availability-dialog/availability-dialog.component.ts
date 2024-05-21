import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { CommonService } from 'src/app/service/common.service';
import { DialogComponent } from 'src/app/shared/elements/dialog/dialog.component';
import { BookingsService } from '../service/bookings/bookings.service';

@Component({
    selector: 'app-availability-dialog',
    templateUrl: './availability-dialog.component.html',
    styleUrls: [
        './availability-dialog.component.css',
        '../../shared/shared-new-form.css',
        '../../shared/shared.dialog.css',
    ],
})
export class AvailabilityDialogComponent implements OnInit, OnDestroy {
    bookings;
    activities;
    componentDestroyed$: Subject<boolean> = new Subject();

    constructor(
        private bookingsService: BookingsService,
        private commonService: CommonService,
        public dialogRef: MatDialogRef<DialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit(): void {
        this.commonService
            .getActivityAvailability(this.data.date)
            .pipe(takeUntil(this.componentDestroyed$))
            .subscribe(
                ({ data }) => {
                    this.mergeData(data.activityAvailability.bookings, data.activityAvailability.orders);
                },
                (error) => {
                    console.log(error);
                }
            );
    }

    mergeData(rawbookings, rawOrders) {
        const bookings = rawbookings.map((booking) => Object.assign({}, booking, { type: 'Booking' }));
        const orders = rawOrders.map((order) => Object.assign({}, order, { type: 'Order' }));
        const merged = bookings.concat(orders);
        this.activities = merged;
    }

    getCustomerName(activity) {
        return activity.type === 'Booking' ? activity.senderFullName : activity.customerFullName;
    }

    getPostcode(activity) {
        return activity.type === 'Booking' ? activity.pickUpPostCode : activity.deliveryPostCode;
    }

    getAddress(activity) {
        return activity.type === 'Booking' ? activity.pickUpAddress : activity.deliveryAddress;
    }

  getPhoneNumber(activity) {
    return activity.type === 'Booking' ? activity.senderPhone : activity.customerPhone;
    }

    getTime(activity) {
        return activity.type === 'Booking' ? activity.pickUpTime : activity.deliveryTime;
    }

    ngOnDestroy() {
        this.componentDestroyed$.next(true);
        this.componentDestroyed$.complete();
    }
}
