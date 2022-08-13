import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { CustomerDetailComponent } from 'src/app/customer/customer-detail/customer-detail.component';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  @ViewChild(CustomerDetailComponent) customerDetailComponent: CustomerDetailComponent;

  @Input() order;
  @Input() mode

  constructor() { }

  ngOnInit(): void {
  }

  getOrderInfo() {
    return {
      deliveryDate: this.order.deliveryDate,
      deliveryTime: this.order.deliveryTime,
      deliveryPostCode: this.order.deliveryPostCode,
      deliveryAddress: this.order.deliveryAddress,
      updatesViaWhatsapp: this.order.updatesViaWhatsapp,
      updatesViaEmail: this.order.updatesViaEmail,
      reference: this.order.reference,
      paymentType: this.order.paymentType,
      paymentStatus: this.order.paymentStatus,
      paymentNotes: this.order.paymentNotes,
      amountPaid: this.order.amountPaid,
      amountOutstanding: this.order.amountOutstanding,
    }
  }

  onForward(stepper: MatStepper, componentName: string) {
    if (!this[componentName].isDisabled())
    {
      if (stepper._getFocusIndex() === 3)
      {
        // this.buildBook();
        // this.bookingReviewComponent.updateBook(this.booking)
      }
      stepper.next();
    }
  };

}
