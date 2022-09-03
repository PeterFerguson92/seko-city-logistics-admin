import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/service/common.service';
import { CustomersService } from '../service/customers.service';

@Component({
  selector: 'app-customer-booking-history',
  templateUrl: './customer-booking-history.component.html',
  styleUrls: ['./customer-booking-history.component.css', '../../shared/shared-table.css']
})
export class CustomerBookingHistoryComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['DATE', 'POSTCODE', 'SENDER', 'DESTINATION', 'PAYMENT', 'BOOKING STATUS', 'ID', 'ACTION'];
  bookings
  includeArchive = false;
  bookingReportData;
  itemTypeOccurrenceReportData;
  itemQuantityReportData;
  itemAmountReportData;
  yearBookingsAmountReportData;
  dataSource

  constructor(private activatedroute: ActivatedRoute,
    private customerService: CustomersService, private commonService: CommonService) { }

  ngOnInit(): void {
    this.activatedroute.data.subscribe(data => {
      const reference = data.bookings.reference;
      this.bookings = data.bookings.data;
      console.log(this.bookings)
      this.dataSource = new MatTableDataSource(this.bookings);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log(data)
      this.getReportData(reference)
    });
  }

  getReportData(reference) {
    this.customerService.getCustomerReport(reference).subscribe(
      ({ data }) => {
        console.log(data)
        this.bookingReportData = this.buildBookingDestinationData(data.customerReport.bookings);
        this.yearBookingsAmountReportData = this.buildActivityReportData(data.customerReport.monthly).yearAmountReportData;
        const result = this.buildItemData(data.customerReport.items)
        this.itemTypeOccurrenceReportData = result.typeData
        this.itemQuantityReportData = result.quantityData
        this.itemAmountReportData = result.amountData
      },
      error => {
        console.log(error);
      }
    )
  }

  buildItemData(rawReport) {
    const typeData = [];
    const quantityData = [];
    const amountData = []
    rawReport.forEach((entry) => {
      typeData.push({ name: entry.type, value: entry.occurrence })
      quantityData.push({ name: entry.type, value: entry.quantity })
      amountData.push({ name: entry.type, value: entry.amount })
    });
    return { typeData, quantityData, amountData };
  }

  buildBookingDestinationData(rawReport) {
    const data = [];
    rawReport.forEach((entry) => {
      data.push({name: entry.destination, value: entry.occurrence})
    });

    return data;
  }

  buildActivityReportData(reportData) {
    const yearAmountReportData = []
    reportData.forEach((entry) => {
      yearAmountReportData.push({ name: entry.monthName, value: entry.totalAmount })
    });
    return { yearAmountReportData };
  }

  getFormattedDate(date) {
    return this.commonService.getFormattedDate(date);
  }


}
