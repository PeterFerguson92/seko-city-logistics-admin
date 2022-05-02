import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IBooking } from 'src/app/booking/model';

@Component({
  selector: 'app-list-bookings',
  templateUrl: './list-bookings.component.html',
  styleUrls: ['./list-bookings.component.css']
})
export class ListBookingsComponent implements OnInit {

  items = null;

  constructor(private activatedroute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedroute.data.subscribe(data => {
      this.items = data.items;
    })
  }

}
