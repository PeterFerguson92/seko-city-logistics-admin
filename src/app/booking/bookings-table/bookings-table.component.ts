import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ICustomer } from 'src/app/customer/model';
import { CommonService } from 'src/app/service/common.service';
import { IBooking } from '../model';

@Component({
  selector: 'app-bookings-table',
  templateUrl: './bookings-table.component.html',
  styleUrls: ['./bookings-table.component.css']
})
export class BookingsTableComponent implements OnInit, OnChanges {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() bookings: [IBooking] = null;
  displayedColumns: string[] = ['ID', 'NAME', 'DESTINATION', 'POSTCODE', 'DATE', 'PAYMENT STATUS', 'ACTION'];
  dataSource = null;
  height =  '80%'
  width = '65%'

  constructor(private router: Router,
    private commonService:CommonService) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.buildData(changes.bookings.currentValue)
  }

  ngOnInit(): void {
    this.buildData(this.bookings);
  }

  addBooking() {

  }

  editBooking(element) {
    console.log(element)
    this.router.navigate(['/edit-booking', element.reference, element.senderReference]);
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
