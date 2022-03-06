import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationService, postCodeValidator } from 'src/app/service/validation/validation.service';
import { CustomersService } from '../service/customers.service';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.css', '../../shared/shared.css']
})
export class CustomerDetailComponent implements OnInit {

  formValidationMap = {
    fullName: '',
    phone: '',
    email: '',
    address: '',
    postcode: '',
    country: ''
  };

  types = ['PERSONAL', 'BUSINESS', 'CHARITY'];
  countries = ['UNITED KINGDOM', 'GHANA'];
  addEditCustomerForm: FormGroup;


  constructor(private formBuilder: FormBuilder,
    private customersService: CustomersService,
    private validationService: ValidationService) { }

  ngOnInit(): void {
    this.addEditCustomerForm = this.formBuilder.group({
      type: [this.types[0], [Validators.required]],
      fullName: ['', Validators.required],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required]],
      postcode: ['', [Validators.required, postCodeValidator]],
      country: [this.countries[0], [Validators.required]]
    });

    this.validateFormControl('fullName');
    this.validateFormControl('phone');
    this.validateFormControl('email');
    this.validateFormControl('address');
    this.validateFormControl('postcode');
  }

  onAddEdit() {
    console.log(this.addEditCustomerForm.get('email'));
  }

  onSelectionChange(event, controlName) {
    this.addEditCustomerForm.get(controlName).setValue(event.value);
  }

  validateFormControl(fControlName: string) {
    const fControl = this.addEditCustomerForm.get(fControlName);
    this.validationService.watchAndValidateFormControl(fControl)
      .subscribe(value => this.formValidationMap[fControlName] = this.validationService.setMessage(fControl, fControlName));
  }
}
