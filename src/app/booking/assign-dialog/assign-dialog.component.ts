import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BOOKING_STATUSES } from 'src/app/constants';
import { DialogComponent } from 'src/app/shared/elements/dialog/dialog.component';
import { BookingsService } from '../service/bookings.service';

@Component({
  selector: 'app-assign-dialog',
  templateUrl: './assign-dialog.component.html',
  styleUrls: ['./assign-dialog.component.css']
})
export class AssignDialogComponent implements OnInit {
  bookingInfoForm: FormGroup;
  bookingStatuses = BOOKING_STATUSES;

  constructor(private formBuilder: FormBuilder,
    private bookingService: BookingsService,
    public dialogRef: MatDialogRef<DialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.bookingInfoForm = this.formBuilder.group({
      status: [this.data.booking.status],
      shipmentReference: [this.data.booking.shipmentReference],
    });
  }

  onUpdate() {
    const updateCustomerFields = [{ name: 'status', value: this.getFormControl('status').value },
      { name: 'shipmentReference', value: this.getFormControl('shipmentReference').value }];
      console.log(updateCustomerFields)
      this.bookingService.updateBooking(this.data.booking.reference, updateCustomerFields).subscribe(
        ({ data }) => {
           location.reload();  // To handle properly
        },
        error => {
          console.log(error);
        }
      );
    }

  onSelectionChange(event: any, fControlName: string) {
      console.log(event)
      const fControl = this.getFormControl(fControlName);
      fControl.setValue(event.value);
      fControl.markAsDirty();
    }


  getFormControl(fControlName: string) {
    return this.bookingInfoForm.get(fControlName)
  }
}
