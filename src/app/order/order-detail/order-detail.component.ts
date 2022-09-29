import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { lastValueFrom, Subject, takeUntil } from 'rxjs';
import { CREATE_ORDER_MODE, EDIT_ORDER_MODE } from 'src/app/constants';
import { CustomerDetailComponent } from 'src/app/customer/customer-detail/customer-detail.component';
import { CustomersService } from 'src/app/customer/service/customers.service';
import { ItemService } from 'src/app/items/item.service';
import { OrderInfoComponent } from '../order-info/order-info.component';
import { OrderReviewComponent } from '../order-review/order-review.component';
import { OrderService } from '../service/order.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css','../../shared/common.css']
})
export class OrderDetailComponent implements OnInit, OnDestroy {
  @ViewChild(CustomerDetailComponent) customerDetailComponent: CustomerDetailComponent;
  @ViewChild(OrderInfoComponent) orderInfoComponent: OrderInfoComponent;
  @ViewChild(OrderReviewComponent) orderReviewComponent: OrderReviewComponent;

  @Input() order;
  @Input() mode
  errorText;
  showErrorText = false;
  componentDestroyed$: Subject<boolean> = new Subject();

  constructor(
    private router: Router,
    private itemService: ItemService,
    private orderService: OrderService,
    private customerService: CustomersService) { }

  ngOnInit(): void {}

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
      if (stepper._getFocusIndex() === 1)
      {
        this.buildOrderReviewData();
        this.orderReviewComponent.updateOrder(this.order)
      }
      stepper.next();
    }
  };

  buildOrderReviewData() {
    this.order.orderCustomer = this.customerDetailComponent.getSenderDetails();
    this.order.info = this.orderInfoComponent.getOrderInfoDetails();
  }

  onSave() {
    this.createOrder(true)
  }

  async onSubmit() {
    if (CREATE_ORDER_MODE === this.mode)
    {
      this.createOrder(false);
    } else
    {
      if (EDIT_ORDER_MODE === this.mode)
      {
        this.editOrder();
      } else
      {
        this.addOrder();
      }
    }
  }

  async createOrder(isPending) {
    const customerDetails = await this.saveCustomer(this.order.orderCustomer);
    const orderDto = this.buildOrderDto(customerDetails.id, customerDetails.reference,
      customerDetails.fullName, customerDetails.fullPhoneNumber)
    this.createOrderRequest(orderDto, isPending);
  }


  async saveCustomer(customerDetails) {
    const saved = await lastValueFrom(this.customerService.createCustomer(customerDetails))
     // tslint:disable-next-line:no-string-literal
    const details = saved.data['createCustomer'];
    return {
      reference: details.reference, fullName: details.fullName,
      id: details.id, fullPhoneNumber: details.fullPhoneNumber };
  }

  buildOrderDto(customerId: number, customerReference: string,
    customerFullName: string, customerPhone: string) {
    const dto = {
      customerId, customerReference, customerFullName, customerPhone,
      ...this.order.info, reference: this.order.reference
    }
    return dto
  }

  createOrderRequest(orderDto, isPending) {
    this.orderService.createOrder(orderDto, isPending).subscribe(
      ({ data }) => {
       this.redirectToOrders()
      },
      error => {
        console.log(error);
      }
    )
  }

  async editOrder() {
    let orderDto = {}
    const customerUpdateFields = this.getDifference(this.order.orderCustomer, this.order.customer);
    if (customerUpdateFields.length > 0)
      {
      const details = await this.updateCustomer(this.order.customer.reference, customerUpdateFields);
      orderDto = this.buildOrderDto(details.id, details.reference, details.fullName, details.fullPhoneNumber);
    } else
    {
      orderDto = this.buildOrderDto(this.order.customer.id, this.order.customer.reference,
        this.order.customer.fullName, this.order.customer.fullPhoneNumber);
    }
    this.syncOrder(orderDto)
  }

  getDifference(obj1, obj2) {
    const updateFields = []
    Object.entries(obj1).forEach((key) => {
      const name = key[0];
      const value = key[1];
      if (obj1[name] !== obj2[name])
      {
        updateFields.push({name, value})
      }
    })
    return updateFields;
  }

  async updateCustomer(reference, fields) {
    const saved = await lastValueFrom(this.customerService.updateCustomer(reference, fields))
    // tslint:disable-next-line:no-string-literal
    const details = saved.data['updateCustomer'];
    return {
      reference: details.reference,
      fullName: details.fullName,
      id: details.id,
      fullPhoneNumber: details.fullPhoneNumber
    };
  }

  syncOrderItems(orderReference, items) {
    this.itemService.syncOrderItems(orderReference, items)
    .pipe(takeUntil(this.componentDestroyed$))
    .subscribe({
      next: () => { this.redirectToOrders();},
      error: (error) => {
        console.log(error);
        console.log(error.message);
        this.showErrorText = true
        this.errorText = `Operation failed: Please contact system`;
      }
    })
  }

  syncOrder(order) {
    this.orderService.syncOrder(order)
    .pipe(takeUntil(this.componentDestroyed$))
      .subscribe({
        next: () => { this.redirectToOrders();},
        error: (error) => {
          console.log(error);
          console.log(error.message);
          this.showErrorText = true
          this.errorText = `Operation failed: Please contact system`;
        }
      })
  }

  async addOrder() {
   let orderDto = {}
    const customerUpdateFields = this.getDifference(this.order.orderCustomer, this.order.customer);
    if (customerUpdateFields.length > 0) {
      const details = await this.updateCustomer(this.order.customer.reference, customerUpdateFields);
      orderDto = this.buildOrderDto(details.id, details.reference, details.fullName, details.fullPhoneNumber);
    } else
    {
      orderDto = this.buildOrderDto(this.order.customer.id, this.order.customer.reference,
        this.order.customer.fullName, this.order.customer.fullPhoneNumber);
    }
    this.createOrderRequest(orderDto, false);
  }


  redirectToOrders() {
    this.router.navigate(['/orders']).then(() => {
      window.location.reload();
    });
  }

  ngOnDestroy() {
    this.componentDestroyed$.next(true)
    this.componentDestroyed$.complete()
  }

}
