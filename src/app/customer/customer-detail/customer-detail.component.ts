import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomersService } from '../service/customers.service';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.css', '../../shared/shared.css']
})
export class CustomerDetailComponent implements OnInit {

  types = ['PERSONAL', 'BUSINESS', 'CHARITY'];
  countries = ['UNITED KINGDOM', 'GHANA'];
  addEditCustomerForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private customersService: CustomersService,) { }

  ngOnInit(): void {
    this.addEditCustomerForm = this.formBuilder.group({
      type: [this.types[0], [Validators.required]],
      fullName: ['', Validators.required],
      // phone: ['', [Validators.required]],
      // email:['', [Validators.required, Validators.email]] ,
      // address: ['', [Validators.required]],
      // postcode: ['', [Validators.required]],
      country: [this.countries[0], [Validators.required]]
    })
  }

  onAddEdit() {
    console.log(this.addEditCustomerForm);
  }

  onSelectionChange(event, controlName) {
    this.addEditCustomerForm.get(controlName).setValue(event.value);
  }
}
