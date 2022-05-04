import { Component, OnInit } from '@angular/core';
import { BookingsService } from '../booking/service/bookings/bookings.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  bookingReportData;
  saleData = [
    { name: 'Mobiles', value: 105000 },
    { name: 'Laptop', value: 55000 },
    { name: 'AC', value: 15000 },
    { name: 'Headset', value: 150000 },
    { name: 'Fridge', value: 20000 }
  ];
  constructor(private bookingService: BookingsService) { }

  ngOnInit(): void {
    this.bookingService.getBookingsDestinationReport().subscribe(
      ({ data }) => {
       this.bookingReportData = this.buildData(data.bookingsDestinationReport)
      },
      error => {
        console.log(error);
      }
    )
  }

  buildData(destinationReportData) {
    const data = [];
    destinationReportData.forEach((entry) => {
      data.push({name: entry.destination, value: entry.occurrence})
    });

    return data;
  }

}
