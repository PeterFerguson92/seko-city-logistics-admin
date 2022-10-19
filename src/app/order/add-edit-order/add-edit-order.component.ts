import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ADD_BOOKING_CUSTOMER_MODE, ADD_ORDER_CUSTOMER_MODE, CREATE_ORDER_MODE, EDIT_ORDER_MODE } from 'src/app/constants';
import { OrderService } from '../service/order.service';

@Component({
  selector: 'app-add-edit-order',
  templateUrl: './add-edit-order.component.html',
  styleUrls: ['./add-edit-order.component.css', '../../shared/shared-new-form.css']
})
export class AddEditOrderComponent implements OnInit {
  order: any = {};
  mode = null;

  constructor(private activatedRoute: ActivatedRoute, private router: Router,) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(data => {
        if (this.router.url.includes('edit-order'))
        {
          if (this.isDataEmpty(data))
          {
            this.router.navigate(['/not-found']);
          }
          this.mode = EDIT_ORDER_MODE
          this.order = Object.assign({}, data.order[0].data.orderByReference);
        } else
        {
          if (this.router.url.includes('add-order'))
          {
            if (this.isDataEmpty(data))
            {
              this.router.navigate(['/not-found']);
            }
            this.order.customer = data.customer;
          }
          this.mode = ADD_BOOKING_CUSTOMER_MODE;
        }
    })
  }

  isDataEmpty(data) {
    return data === null || data.orderByReference === null
  }
}
