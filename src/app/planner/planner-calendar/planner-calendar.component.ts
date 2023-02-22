import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CalendarOptions, EventInput } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, takeUntil } from 'rxjs';
import { BookingsService } from 'src/app/booking/service/bookings/bookings.service';
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
        private bookingService: BookingsService,
        private spinner: NgxSpinnerService
    ) {}

    ngOnInit(): void {
        this.getBookings();
    }

    getBookings() {
        this.spinner.show();

        this.bookingService
            .getBookings()
            .pipe(takeUntil(this.componentDestroyed$))
            .subscribe({
                next: (result) => {
                    this.buildEvents(result.data.bookings);
                    this.spinner.hide();
                },
                error: (error) => {
                    console.log(error.message);
                    console.log(error);
                },
            });
    }

    buildEvents(bookings) {
        const bookingsEvent = [];
        for (const booking of bookings) {
            const date = new Date(booking.pickUpDate).toISOString().substring(0, 10);
            bookingsEvent.push({
                title: `${booking.senderFullName} - ${booking.pickUpPostCode}`,
                date,
                reference: booking.reference,
            });
        }
        this.calendarOptions.events = bookingsEvent;
    }

    handleDateClick(arg) {
        console.log(arg);
        alert('date click! ' + arg.dateStr);
    }

    onClickDate(data) {
        this.router.navigate(['/booking-summary', data._def.extendedProps.reference]);
    }

    ngOnDestroy() {
        this.componentDestroyed$.next(true);
        this.componentDestroyed$.complete();
    }
}
