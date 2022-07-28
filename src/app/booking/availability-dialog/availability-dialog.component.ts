import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/shared/elements/dialog/dialog.component';
import { BookingsService } from '../service/bookings/bookings.service';

@Component({
  selector: 'app-availability-dialog',
  templateUrl: './availability-dialog.component.html',
  styleUrls: ['./availability-dialog.component.css', '../../shared/shared-new-form.css']
})
export class AvailabilityDialogComponent implements OnInit {

  bookings;

  constructor(private bookingsService: BookingsService,
    public dialogRef: MatDialogRef<DialogComponent>,@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.bookingsService.filterBookings( [{ name: 'pickUpDate', value: this.data.date }]).subscribe(
      ({ data }) => {
        // tslint:disable-next-line:no-string-literal
        this.bookings = data['filterBookings'];
      },
      error => {
        console.log(error);
      }
    );
  }
}
