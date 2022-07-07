import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/service/common.service';
import { DialogComponent } from 'src/app/shared/elements/dialog/dialog.component';
import { BookingAssignDriverDialogComponent } from '../booking-assign-driver-dialog/booking-assign-driver-dialog.component';
import { BookingUpdateDialogComponent } from '../booking-update-dialog/booking-update-dialog.component';
import { IBooking } from '../model';
import { BookingsService } from '../service/bookings/bookings.service';

@Component({
  selector: 'app-bookings-table',
  templateUrl: './bookings-table.component.html',
  styleUrls: ['./bookings-table.component.css']
})
export class BookingsTableComponent implements OnInit, OnChanges {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() bookings: [IBooking] = null;
  @Input() includeArchived = false;
  displayedColumns: string[] = ['ID', 'NAME', 'DESTINATION', 'POSTCODE', 'DATE', 'PAYMENT STATUS', 'BOOKING STATUS', 'ACTION'];
  dataSource = null;
  height = '80%';
  width = '65%';
  isArchivedEnabled = false;

  constructor(private router: Router,
    private bookingsService: BookingsService,
    private commonService: CommonService,
    private dialog: MatDialog) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.buildData(changes.bookings.currentValue)
    if (changes.includeArchived)
    {
      this.isArchivedEnabled = changes.includeArchived.currentValue;
    };
  }

  ngOnInit(): void {
    this.buildData(this.bookings);
  }

  onAddBooking() {
    this.router.navigate(['/add-booking']);
  }

  updateBooking(booking) {
    const dialogRef = this.dialog.open(BookingUpdateDialogComponent, {
      // height: '80%',
      // width: '65%',
      data: { booking }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
    })
  }

  viewBooking(reference) {
    this.router.navigate(['/booking-summary', reference]);
  }

  editBooking(element) {
    this.router.navigate(['/edit-booking', element.reference, element.senderReference]);
  }

  deleteBooking(reference) {
    const dialogRef = this.dialog.open(DialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'true')
      {
        this.bookingsService.deleteBooking(reference).subscribe(
          ({ data }) => {
            location.reload()
          },
          error => {
            console.log(error);
          }
        )
      }
    })
  }

  archiveBooking(reference) {
    this.bookingsService.archiveUnarchiveBooking(reference, !this.isArchivedEnabled).subscribe(
      ({ data }) => {
        location.reload()
      },
      error => {
        console.log(error);
      }
    )
  }

  onAssignDriver(reference, driverReference) {
      {
        const dialogRef = this.dialog.open(BookingAssignDriverDialogComponent, {
          // height: '80%',
          // width: '65%',
          data: { reference, driverReference }
        });
        dialogRef.afterClosed().subscribe(result => {
          // console.log(result)
        })
      }
  }

  getFormattedDate(date) {
    return this.commonService.getFormattedDate(date);
  }

  buildData(data) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}
