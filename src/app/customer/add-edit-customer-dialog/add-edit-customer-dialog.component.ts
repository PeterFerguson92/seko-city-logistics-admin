import { Component, Inject, OnInit } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogComponent } from 'src/app/shared/elements/dialog/dialog.component';
import { ICustomer } from '../model';

@Component({
  selector: 'app-add-edit-customer-dialog',
  templateUrl: './add-edit-customer-dialog.component.html',
  styleUrls: ['./add-edit-customer-dialog.component.css']
})
export class AddEditCustomerDialogComponent implements OnInit {

  customer: ICustomer = null;
  mode = null;
  constructor(public dialogRef: MatDialogRef<DialogComponent>,@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    console.log(this.data)

    this.customer = this.data.customer;
    this.mode = this.data.mode;
  }

  closeDialog(event) {
    this.onNoClick()
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
