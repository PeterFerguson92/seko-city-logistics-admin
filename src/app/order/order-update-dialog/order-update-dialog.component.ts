import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ORDER_STATUSES, PAYMENT_STATUSES } from 'src/app/constants';
import { DialogComponent } from 'src/app/shared/elements/dialog/dialog.component';
import { OrderService } from '../service/order.service';

@Component({
  selector: 'app-order-update-dialog',
  templateUrl: './order-update-dialog.component.html',
  styleUrls: ['./order-update-dialog.component.css', '../../shared/shared.dialog.css']
})
export class OrderUpdateDialogComponent implements OnInit {
  orderInfoForm: FormGroup;
  orderStatuses = ORDER_STATUSES;
  paymentStatuses = PAYMENT_STATUSES;
  order;

  constructor(private formBuilder: FormBuilder,
    private orderService: OrderService,
    public dialogRef: MatDialogRef<DialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.order = this.data.order;
    this.orderInfoForm = this.formBuilder.group({
      status: [this.data.order.status],
      paymentStatus: [this.data.order.paymentStatus],
    });
  }

  onSelectionChange(event: any, fControlName: string) {
    const fControl = this.getFormControl(fControlName);
    fControl.setValue(event.value);
    fControl.markAsDirty();
  }

  onUpdate() {
    const updateCustomerFields = []
    Object.keys(this.orderInfoForm.controls).forEach(key => {
      const formControl = this.orderInfoForm.controls[key]
      if (!formControl.pristine && formControl.value !== this.order[key])
      {
        updateCustomerFields.push({ name: key, value: formControl.value });
      }
    });
    if (updateCustomerFields.length > 0)
    {
      this.orderService.updateOrder(this.order.reference, updateCustomerFields).subscribe(
        ({ data }) => {
          location.reload();
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  getFormControl(fControlName: string) {
    return this.orderInfoForm.get(fControlName)
  }

  isDisabled() {
    return this.orderInfoForm.pristine
  }


}
