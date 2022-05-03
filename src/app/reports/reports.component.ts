import { Component, OnInit } from '@angular/core';
import { BookingsService } from '../booking/service/bookings/bookings.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  constructor(private bookingService: BookingsService) { }

  ngOnInit(): void {
    this.bookingService.getBookingsDestinationReport().subscribe(
      ({ data }) => {
       console.log(data)
      },
      error => {
        console.log(error);
      }
    )
  }

}
