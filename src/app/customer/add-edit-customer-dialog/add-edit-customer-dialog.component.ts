import { Component, Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ICustomer } from '../domain';

@Component({
  selector: 'app-add-edit-customer-dialog',
  templateUrl: './add-edit-customer-dialog.component.html',
  styleUrls: ['./add-edit-customer-dialog.component.css']
})
export class AddEditCustomerDialogComponent implements OnInit {

  customer: ICustomer = null;
  mode = null;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.customer = this.data.customer;
    this.mode = this.data.mode;
  }
}
