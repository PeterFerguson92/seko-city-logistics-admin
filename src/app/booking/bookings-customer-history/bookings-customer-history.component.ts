import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { BookingsService } from '../service/bookings/bookings.service';

@Component({
  selector: 'app-bookings-customer-history',
  templateUrl: './bookings-customer-history.component.html',
  styleUrls: ['./bookings-customer-history.component.css']
})
export class BookingsCustomerHistoryComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = null;
  bookings
  includeArchive = false
  constructor(private activatedroute: ActivatedRoute, private bookingService: BookingsService) { }

  ngOnInit(): void {
    this.activatedroute.data.subscribe(data => {
      console.log(data.bookings.data);
      this.bookings = data.bookings.data
    });
  }

}
