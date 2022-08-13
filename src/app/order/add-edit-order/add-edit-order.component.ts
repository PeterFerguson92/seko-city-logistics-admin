import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ADD_ORDER_CUSTOMER_MODE, CREATE_ORDER_MODE, EDIT_ORDER_MODE } from 'src/app/constants';

@Component({
  selector: 'app-add-edit-order',
  templateUrl: './add-edit-order.component.html',
  styleUrls: ['./add-edit-order.component.css', '../../shared/shared-new-form.css']
})
export class AddEditOrderComponent implements OnInit {
  order: any = {};
  mode = null;
  constructor(private activatedroute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.activatedroute.data.subscribe(data => {
      if (this.router.url.includes('edit-booking'))
      {
        this.mode = EDIT_ORDER_MODE
        this.order = Object.assign({selected: false}, data.booking[0].data.bookingByReference);
        this.order.customer = data.order[1].data.customerByReference;
      } else
      {
        this.order.customer = data.customer;
        this.mode = data.customer ? ADD_ORDER_CUSTOMER_MODE : CREATE_ORDER_MODE;
      }
    })
  }

}
