import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ADD_ORDER_CUSTOMER_MODE, CREATE_ORDER_MODE, EDIT_ORDER_MODE } from 'src/app/constants';

@Component({
    selector: 'app-add-edit-order',
    templateUrl: './add-edit-order.component.html',
    styleUrls: ['./add-edit-order.component.css', '../../shared/shared-new-form.css'],
})
export class AddEditOrderComponent implements OnInit {
    order: any = {};
    mode = null;

    constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

    ngOnInit(): void {
        this.activatedRoute.data.subscribe((data) => {
            const snapshot = this.activatedRoute.snapshot;
            if (this.router.url.includes('edit-order')) {
                if (this.isDataEmpty(data)) {
                    this.router.navigate(['/not-found']);
                }
                this.mode = EDIT_ORDER_MODE;
                this.order = Object.assign({}, data.order[0].data.orderByReference);
                this.order.customer = data.order[1].data.customerByReference;
            } else {
                if (this.router.url.includes('add-order')) {
                    if (this.isDataEmpty(data)) {
                        this.router.navigate(['/not-found']);
                    }
                    this.order.customer = data.customer;
                }
            }
            this.setMode(snapshot.routeConfig.path);
        });
    }

    isDataEmpty(data) {
        return data === null || data.orderByReference === null;
    }

    setMode(path) {
        if (path === 'add-order') {
            this.mode = CREATE_ORDER_MODE;
        }

        if (path === 'add-order/:reference') {
            this.mode = ADD_ORDER_CUSTOMER_MODE;
        }

        if (path === 'edit-order/:reference/:customerReference') {
            this.mode = EDIT_ORDER_MODE;
        }
    }
}
