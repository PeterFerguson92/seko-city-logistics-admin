import { Component, OnInit } from '@angular/core';
import { BookingsService } from '../booking/service/bookings/bookings.service';
import { ItemService } from '../booking/service/items/item.service';
import { jsPDF } from 'jspdf';
import domtoimage from 'dom-to-image';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  bookingReportData;
  itemTypeOccurrenceReportData;
  itemQuantityReportData;
  itemAmountReportData;
  saleData = [
    { name: 'Mobiles', value: 105000 },
    { name: 'Laptop', value: 55000 },
    { name: 'AC', value: 15000 },
    { name: 'Headset', value: 150000 },
    { name: 'Fridge', value: 20000 }
  ];
  constructor(private bookingService: BookingsService, private itemService: ItemService) { }

  ngOnInit(): void {
    this.getBookingDestinationReportData();
    this.getItemsReportData();

  }

  getItemsReportData() {
    this.itemService.getItemsReport().subscribe(
      ({ data }) => {
        // console.log(data.itemsDestinationReport)
        const result = this.buildItemData(data.itemsDestinationReport)
        this.itemTypeOccurrenceReportData = result.typeData
        this.itemQuantityReportData = result.quantityData
        this.itemAmountReportData = result.amountData

     //   console.log( this.bookingReportData)

      //  this.bookingReportData = this.buildBookingDestinationData(data.bookingsDestinationReport)
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
}
