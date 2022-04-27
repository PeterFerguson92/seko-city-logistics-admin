import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IBooking } from 'src/app/booking/model';

@Component({
  selector: 'app-assign-bookings',
  templateUrl: './assign-bookings.component.html',
  styleUrls: ['./assign-bookings.component.css']
})
export class AssignBookingsComponent implements OnInit {

  bookings: [IBooking] = null;

  constructor(private activatedroute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedroute.data.subscribe(data => {
      this.bookings = data.bookings;
    })
  }
}
