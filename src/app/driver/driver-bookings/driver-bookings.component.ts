import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, takeUntil } from 'rxjs';
import { BookingsService } from 'src/app/booking/service/bookings/bookings.service';
import { CommonService } from 'src/app/service/common.service';
@Component({
  selector: 'app-driver-bookings',
  templateUrl: './driver-bookings.component.html',
  styleUrls: ['./driver-bookings.component.css',
    '../../shared/shared-table.css', '../../shared/common.css']
})
export class DriverBookingsComponent implements OnInit, OnDestroy {

  dataSource = null;
  isError = false;
  errorMsg = null;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  componentDestroyed$: Subject<boolean> = new Subject();
  displayedColumns: string[] = ['ID', 'SENDER', 'POSTCODE', 'ADDRESS', 'DATE', 'TIME', 'PHONE', 'STATUS', 'ACTION'];


  constructor(
    private router: Router,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private commonService: CommonService,
    private activatedRoute: ActivatedRoute,
    private bookingService: BookingsService
    ) { }

  ngOnInit(): void {
    const snapshot = this.activatedRoute.snapshot;
    const reference = snapshot.paramMap.get('reference');
    if (snapshot.routeConfig.path !== 'add-shipment')
    {
      this.getBookingsByDriverReference(reference);
    }
  }

  getBookingsByDriverReference(reference) {
    this.spinner.show();
    this.bookingService.filterBookings({name: 'assignedDriverReference', value: reference})
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe({
        next: (result) => {
          if (this.isDataEmpty(result))
          {
            this.errorMsg = 'No Records found'
            this.isError = true;
            this.spinner.hide()
          } else
          {
            this.dataSource = new MatTableDataSource(result.data.filterBookings);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.spinner.hide();
          }
        },
        error: (error) => {
          this.errorMsg = 'Something went wrong, please contact system support';
          this.isError = true;
          console.log(error.message);
          console.log(error);
          this.spinner.hide()
        }
    })
  }

  isDataEmpty(result) {
    return (result === null || result.data === null ||
      result.data.filterBookings === null) && result.data.filterBookings.length === 0
  }

  onViewBooking(reference) {
    this.router.navigate(['/booking-summary', reference]);
  }

  getFormattedDate(date) {
    return this.commonService.getFormattedDate(date);
  }

  ngOnDestroy() {
    this.componentDestroyed$.next(true)
    this.componentDestroyed$.complete()
  }
}
