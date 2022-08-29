import { Component, OnDestroy, OnInit } from '@angular/core';
import { BookingsService } from '../booking/service/bookings/bookings.service';
import { ItemService } from '../items/item.service';
import { jsPDF } from 'jspdf';
import domtoimage from 'dom-to-image';
import { OrderService } from '../order/service/order.service';
import { takeUntil } from 'rxjs/operators'
import { Subject } from 'rxjs';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit, OnDestroy {

  bookingReportData;
  itemTypeOccurrenceReportData;
  itemQuantityReportData;
  itemAmountReportData;
  yearOrderAmountReportData;
  yearBookingsAmountReportData;
  saleData = [
    { name: 'Mobiles', value: 105000 },
    { name: 'Laptop', value: 55000 },
    { name: 'AC', value: 15000 },
    { name: 'Headset', value: 150000 },
    { name: 'Fridge', value: 20000 }
  ];
  componentDestroyed$: Subject<boolean> = new Subject();

  constructor(private bookingService: BookingsService, private itemService: ItemService,
    private orderService: OrderService) { }

  ngOnInit(): void {
    this.getBookingDestinationReportData();
    this.getItemsReportData();
    this.getOrdersReport();
    this.getBookingsReport()

  }

  getItemsReportData() {
    this.itemService.getItemsReport().subscribe(
      ({ data }) => {
        const result = this.buildItemData(data.itemsDestinationReport)
        this.itemTypeOccurrenceReportData = result.typeData
        this.itemQuantityReportData = result.quantityData
        this.itemAmountReportData = result.amountData
      },
      error => {
        console.log(error);
      }
    )
  }

  getBookingDestinationReportData() {
    this.bookingService.getBookingsDestinationReport().subscribe(
      ({ data }) => {
       this.bookingReportData = this.buildBookingDestinationData(data.bookingsDestinationReport)
      },
      error => {
        console.log(error);
      }
    )
  }

  buildBookingDestinationData(destinationReportData) {
    const data = [];
    destinationReportData.forEach((entry) => {
      data.push({name: entry.destination, value: entry.occurrence})
    });

    return data;
  }

  buildItemData(destinationReportData) {
    const typeData = [];
    const quantityData = [];
    const amountData = []
    destinationReportData.forEach((entry) => {
      typeData.push({ name: entry.type, value: entry.occurrence })
      quantityData.push({ name: entry.type, value: entry.quantity })
      amountData.push({name: entry.type, value: entry.amount})
    });

    return { typeData, quantityData, amountData };
  }

  getBookingsReport() {
    const currentMonthId = new Date().getMonth() + 1;
    this.bookingService.getBookingsReport()
    .pipe(takeUntil(this.componentDestroyed$))
    .subscribe(
      ({ data }) => {
        console.log(data)
        this.yearBookingsAmountReportData = this.buildActivityReportData(data.bookingsReport.monthly).yearAmountReportData;

      },
      error => {
        console.log(error);
      }
    )
  }

  getOrdersReport() {
    this.orderService.getOrdersReport()
    .pipe(takeUntil(this.componentDestroyed$))
    .subscribe(
      ({ data }) => {
        this.yearOrderAmountReportData = this.buildActivityReportData(data.ordersReport.monthly).yearAmountReportData;
      },
      error => {
        console.log(error);
      }
    )
  }

  buildActivityReportData(reportData) {
    const yearAmountReportData = []
    console.log(reportData)
    reportData.forEach((entry) => {
      yearAmountReportData.push({ name: entry.monthName, value: entry.totalAmount })
    });
    return { yearAmountReportData };
  }

  exportAsPDF() {
    const summary = document.getElementById('summary');
    const height = summary.clientHeight;
    const width = summary.clientWidth;
    const options = { background: 'white', width , height };

    domtoimage.toPng(summary, options).then((imgData) => {
      const doc = new jsPDF(width > height ? 'l' : 'p', 'mm', [width, height]);
      const imgProps = doc.getImageProperties(imgData);
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      doc.save('report_'+ new Date() + '.pdf');
    })
  }

  ngOnDestroy() {
    this.componentDestroyed$.next(true)
    this.componentDestroyed$.complete()
  }
}
