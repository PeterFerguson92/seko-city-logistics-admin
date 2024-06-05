import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CalendarOptions, EventInput } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, takeUntil } from 'rxjs';
import { BookingsService } from 'src/app/booking/service/bookings/bookings.service';
import { OrderService } from 'src/app/order/service/order.service';
@Component({
    selector: 'app-planner-calendar',
    templateUrl: './planner-calendar.component.html',
    styleUrls: ['./planner-calendar.component.css'],
})
export class PlannerCalendarComponent implements OnInit, OnDestroy {
    calendarOptions: CalendarOptions = {
        initialView: 'dayGridMonth',
        plugins: [dayGridPlugin],
        events: [
            { title: 'event 1', date: '2023-04-01' },
            { title: 'event 2', date: '2023-02-02' },
            { title: 'event 3', date: '2023-02-02' },
            { title: 'event 3', date: '2023-02-02' },
        ],
    };
    componentDestroyed$: Subject<boolean> = new Subject();

    constructor(
        private router: Router,
        private orderService: OrderService,
        private bookingService: BookingsService,
        private spinner: NgxSpinnerService
    ) {}

    ngOnInit(): void {
        this.getBookings();
    }

    getBookings() {
        this.spinner.show();

        this.bookingService
            .filterBookings({ name: 'archived', value: 'false' })
            .pipe(takeUntil(this.componentDestroyed$))
            .subscribe({
                next: (result) => {
                    this.getOrders(result.data.filterBookings);
                    this.spinner.hide();
                },
                error: (error) => {
                    console.log(error.message);
                    console.log(error);
                },
            });
    }

    getOrders(bookings) {
        this.orderService
            .filterOrders({ name: 'archived', value: 'false' })
            .pipe(takeUntil(this.componentDestroyed$))
            .subscribe({
                next: (result) => {
                    console.log(result.data.filterOrders);
                    this.buildEvents(bookings, result.data.filterOrders);
                },
                error: (error) => {
                    console.log(error.message);
                    console.log(error);
                },
            });
    }

    buildEvents(bookings, orders) {
        const events = [];
        for (const booking of bookings) {
            const date = new Date(booking.pickUpDate).toISOString().substring(0, 10);
            events.push({
                type: 'BOOKING',
                title: `${booking.senderFullName} - ${booking.pickUpPostCode} - BOOKING`,
                date,
                reference: booking.reference,
                color: 'blue',
            });
        }
        for (const order of orders) {
            const date = new Date(order.deliveryDate).toISOString().substring(0, 10);
            events.push({
                type: 'ORDER',
                title: `${order.customerFullName} - ${order.deliveryPostCode} - ORDER`,
                date,
              reference: order.reference,
              color: 'green',
            });
        }
        this.calendarOptions.events = events;
    }

    onClickDate(data) {
        if (data._def.extendedProps.type === 'BOOKING') {
            this.router.navigate(['/booking-summary', data._def.extendedProps.reference]);
        } else {
            this.router.navigate(['/order-summary', data._def.extendedProps.reference]);
        }
    }

    ngOnDestroy() {
        this.componentDestroyed$.next(true);
        this.componentDestroyed$.complete();
    }
}
