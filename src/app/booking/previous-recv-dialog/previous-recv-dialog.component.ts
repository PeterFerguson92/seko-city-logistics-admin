import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/shared/elements/dialog/dialog.component';
import { BookingsService } from '../service/bookings/bookings.service';

@Component({
  selector: 'app-previous-recv-dialog',
  templateUrl: './previous-recv-dialog.component.html',
  styleUrls: ['./previous-recv-dialog.component.css', './../../shared/shared-new-form.css', '../../shared/shared.dialog.css']
})
export class PreviousRecvDialogComponent implements OnInit {

  receivers = []
  selectedReferences = []

  constructor(private bookingsService: BookingsService,
    public dialogRef: MatDialogRef<DialogComponent>,@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.bookingsService.getPreviousReceivers(this.data.senderReference).subscribe(
      ({ data }) => {
        // tslint:disable-next-line:no-string-literal
        this.buildRecvCheckBox(data['previousReceiversBySender']);
      },
      error => {
        console.log(error);
      }
    );
  }

  buildRecvCheckBox(receiversData) {
    receiversData.forEach((recv) => {
      const isPresent = this.checkIfPresent(recv.reference)
      this.receivers.push({info: recv, selected: isPresent, disabled: isPresent},)
    });

  }

  checkIfPresent(reference) {
    return this.data.currentReferences.includes(reference);
  }

  updateAllComplete(selected, recv) {
    if (selected)
    {
      this.selectedReferences.push(recv.info);
    } else
    {
      this.selectedReferences = this.selectedReferences.filter((item => item.reference !== recv.info.reference))
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
