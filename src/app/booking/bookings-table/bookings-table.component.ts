import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/service/common.service';
import { ConfirmDialogComponent } from 'src/app/shared/elements/confirm-dialog/confirm-dialog.component';
import { BookingUpdateDialogComponent } from '../booking-update-dialog/booking-update-dialog.component';
import { IBooking } from '../model';
import { BookingsService } from '../service/bookings/bookings.service';
import { UpdateItemsDialogComponent } from 'src/app/items/update-items-dialog/update-items-dialog.component';

@Component({
    selector: 'app-bookings-table',
    templateUrl: './bookings-table.component.html',
    styleUrls: ['./bookings-table.component.css', '../../shared/shared-table.css'],
})
export class BookingsTableComponent implements OnInit, OnChanges {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @Input() bookings: [IBooking] = null;
    @Input() includeArchived = false;
    @Input() showAddButton = false;
    displayedColumns: string[] = [
        'ID',
        'POSTCODE',
        'SENDER',
        'DESTINATION',
        'PAYMENT',
        'BOOKING STATUS',
        'DATE',
        'ACTION',
    ];
    dataSource = null;
    height = '80%';
    width = '65%';
    isArchivedEnabled = false;

    constructor(
        private router: Router,
        private bookingsService: BookingsService,
        private commonService: CommonService,
        private dialog: MatDialog
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        this.buildData(changes.bookings.currentValue);
        if (changes.includeArchived) {
            this.isArchivedEnabled = changes.includeArchived.currentValue;
        }
    }

    ngOnInit(): void {
        this.buildData(this.bookings);
    }

    onAddBooking() {
        this.router.navigate(['/add-booking']);
    }

    updateBooking(booking) {
        const dialogRef = this.dialog.open(BookingUpdateDialogComponent, {
            // height: '43%',
            // width: '35%',
            data: { booking },
        });
        dialogRef.afterClosed().subscribe((result) => {
            location.reload();
        });
    }

    updateItemsBooking(reference) {
        const dialogRef = this.dialog.open(UpdateItemsDialogComponent, {
            // height: '43%',
            // width: '35%',
            data: { reference, allItems: true },
        });
        dialogRef.afterClosed().subscribe((result) => {
            location.reload();
        });
    }

    viewBooking(reference) {
        this.router.navigate(['/booking-summary', reference]);
    }

    editBooking(element) {
        this.router.navigate(['/edit-booking', element.reference, element.senderReference]);
    }

    deleteBooking(reference) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            // height: '25%',
            // width: '30%',
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result === 'true') {
                this.bookingsService.deleteBooking(reference).subscribe(
                    ({ data }) => {
                        location.reload();
                    },
                    (error) => {
                        console.log(error);
                    }
                );
            }
        });
    }

    getPickUpDateDetails(pickUpDate) {
        return pickUpDate === null ? 'TBD' : this.getFormattedDate(pickUpDate);
    }

    archiveBooking(reference) {
        this.bookingsService.archiveUnarchiveBooking(reference, !this.isArchivedEnabled).subscribe(
            ({ data }) => {
                location.reload();
            },
            (error) => {
                console.log(error);
            }
        );
    }

    onAssignDriver(element) {
        this.router.navigate(['/booking-driver', element.reference]);
    }

    getFormattedDate(date) {
        return this.commonService.getFormattedDate(date);
    }

    buildData(data) {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    chooseColor(row) {
        if (row.status === 'PENDING') {
            return '#FFEBCA';
        }
    }
}
