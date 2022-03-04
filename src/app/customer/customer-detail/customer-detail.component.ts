import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomersService } from '../service/customers.service';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.css', '../../shared/shared.css']
})
export class CustomerDetailComponent implements OnInit {

  addEditCustomerForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private customersService: CustomersService,) { }

  ngOnInit(): void {
    this.addEditCustomerForm = this.formBuilder.group({
      type: ['', [Validators.required]],
      fullName: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      email:['', [Validators.required, Validators.email]] ,
      address: ['', [Validators.required]],
      postcode: ['', [Validators.required]],
      country: ['', [Validators.required]]
    })
  }

  onAddEdit() {
      console.log(this.addEditCustomerForm.get('fullName').value)
  }

}
