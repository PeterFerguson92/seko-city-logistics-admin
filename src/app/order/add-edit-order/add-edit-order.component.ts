import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, takeUntil } from 'rxjs';
import { ADD_ORDER_CUSTOMER_MODE, CREATE_ORDER_MODE, EDIT_ORDER_MODE } from 'src/app/constants';
import { CustomersService } from 'src/app/customer/service/customers.service';
import { OrderService } from '../service/order.service';

@Component({
  selector: 'app-add-edit-order',
  templateUrl: './add-edit-order.component.html',
  styleUrls: ['./add-edit-order.component.css', '../../shared/shared-new-form.css']
})
export class AddEditOrderComponent implements OnInit, OnDestroy {
  order: any = {};
  mode = null;
  componentDestroyed$: Subject<boolean> = new Subject();

  constructor(
    private spinner: NgxSpinnerService,
    private orderService: OrderService,
    private activatedRoute: ActivatedRoute,
    private customersService: CustomersService,
    private router: Router) { }

  ngOnInit(): void {
    const snapshot = this.activatedRoute.snapshot;
    let reference = null;
    if (snapshot.routeConfig.path === 'add-order')
    {
      this.mode = CREATE_ORDER_MODE;
    }

    if (snapshot.routeConfig.path === 'add-order/:reference')
    {
      this.mode = ADD_ORDER_CUSTOMER_MODE;
      reference = snapshot.paramMap.get('reference');
    }

    if (snapshot.routeConfig.path === 'edit-order/:reference/:customerReference')
    {
      this.mode = EDIT_ORDER_MODE;
      reference = snapshot.paramMap.get('reference');
    }

    if (reference !== null)
    {
      this.getOrderByReference(reference);
    }
  }

  isDataEmpty(data) {
    return data === null || data.orderByReference === null
  }

  getOrderByReference(reference) {
    this.spinner.show();
    this.orderService.getOrderByReference(reference)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe({
        next: (result) => {
          if (result.data.orderByReference === null)
          {
            throw Error('is null');;
          }
          this.order = Object.assign({}, result.data.orderByReference);
          this.getCustomerByReference(this.order.customerReference)
        this.spinner.hide()
      },
      error: (error) => {
        this.spinner.hide();
        console.log('error for order ' + reference)
        console.log(error.message);
        console.log(error)
      }
    })
  }

  getCustomerByReference(reference) {
    this.spinner.show();
    this.customersService.getCustomerByReference(reference)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe({
        next: (result) => {
          if (result.data === null || result.data.customerByReference === null)
          {
            this.router.navigate(['/not-found']);
          } else
          {
            this.order.customer = Object.assign({},result.data.customerByReference );
          }
        },
        error: (error) => {
          console.log(error.message);
          console.log(error)
          this.spinner.hide()
        }
      })
    }

  ngOnDestroy() {
    this.componentDestroyed$.next(true)
    this.componentDestroyed$.complete()
  }
}
