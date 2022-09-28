import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ORDER_STATUSES, PAYMENT_STATUSES } from 'src/app/constants';
import { DialogComponent } from 'src/app/shared/elements/dialog/dialog.component';
import { OrderService } from '../service/order.service';

@Component({
  selector: 'app-order-update-dialog',
  templateUrl: './order-update-dialog.component.html',
  styleUrls: ['./order-update-dialog.component.css', '../../shared/shared.dialog.css']
})
export class OrderUpdateDialogComponent implements OnInit, OnDestroy {
  orderInfoForm: FormGroup;
  orderStatuses = ORDER_STATUSES;
  paymentStatuses = PAYMENT_STATUSES;
  order;
  errorText;
  showErrorText = false;

  componentDestroyed$: Subject<boolean> = new Subject();

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private orderService: OrderService,
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    if (this.data === null || this.data.order === null)
    {
      this.router.navigate(['/not-found']);
    }
    this.order = this.data.order;
    this.orderInfoForm = this.formBuilder.group({
      status: [this.data.order.status]
    });
  }

  onSelectionChange(event: any, fControlName: string) {
    const fControl = this.getFormControl(fControlName);
    fControl.setValue(event.value);
    fControl.markAsDirty();
  }

  onSubmit() {
    this.orderService.updateOrderStatus(this.data.order.reference, this.getFormControl('status').value)
    .pipe(takeUntil(this.componentDestroyed$))
    .subscribe({
      next: (result) => { location.reload(); },
      error: (error) => {
        console.log(error);
        console.log(error.message);
        this.showErrorText = true;
        this.errorText = `Update failed: Please contact system support`;
      }
    })
 }

  getFormControl(fControlName: string) {
    return this.orderInfoForm.get(fControlName)
  }

  isDisabled() {
    return this.orderInfoForm.pristine
  }

  ngOnDestroy() {
    this.componentDestroyed$.next(true)
    this.componentDestroyed$.complete()
  }

}
